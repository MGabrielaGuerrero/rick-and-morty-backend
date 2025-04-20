import axios from 'axios';
import CacheService from './cacheService';
import Character from '../database/models/Character';
import Location from '../database/models/Location';

interface CharacterAPI {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string | null;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  image: string;
  created: string;
  origin: { id: number } | null;
  location: { id: number } | null;
  episode: { id: number }[];
}

interface CharacterFilter {
  originLocationId?: number;
}

/**
 * Servicio para manejar lógica de personajes:
 * - Sincronización desde la API externa
 * - Lectura de DB con caché en Redis
 */
class CharacterService {
  private cache = CacheService;
  private readonly allKey = 'characters:all';

  /**
   * Sincroniza todos los personajes de la API externa a la base de datos.
   */


  async syncCharacters(): Promise<void> {
    let page = 1;
    const fetched: CharacterAPI[] = [];
    if (!process.env.GRAPHQL_URL) {
      throw new Error('GRAPHQL_URL is not defined in the environment variables.');
    }
    while (true) {
      const response = await axios.post(process.env.GRAPHQL_URL, {
        query: `
          query getCharacters($page: Int!) {
            characters(page: $page) {
              info { next }
              results {
                id name status species type gender image created
                origin { id }
                location { id }
                episode { id }
              }
            }
          }
        `, variables: { page }
      });
      const body = response.data.data.characters;
      fetched.push(...body.results);
      if (!body.info.next) break;
      page = body.info.next;
    }

    // Inserta o actualiza cada personaje y su localización
    for (const c of fetched) {
      // Upsert del personaje
      await Character.upsert({
        id: c.id,
        name: c.name,
        status: c.status,
        species: c.species,
        type: c.type ?? undefined,
        gender: c.gender,
        image: c.image,
        created: new Date(c.created),
        episode: c.episode.map(ep => ep.id),
        origin_location_id: c.origin?.id ?? undefined,
        current_location_id: c.location?.id ?? undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Invalidar caché de lista completa
    await this.cache.del(this.allKey);
  }



  /**
   * Recupera un personaje por ID de caché o DB.
   */
  async getCharacterById(id: number): Promise<Character | null> {
    const key = `character:${id}`;
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached) as Character;
    }

    let character = await Character.findByPk(id, {
      include: [
        { model: Location, as: 'originLocation' },
        { model: Location, as: 'currentLocation' }
      ]
    });

    if (!character) {
      console.log("sincronizando")
      await this.syncCharacters();
      character = await Character.findByPk(id, {
        include: [
          { model: Location, as: 'originLocation' },
          { model: Location, as: 'currentLocation' }
        ]
      });
    }
    if (character) {
      await this.cache.set(key, JSON.stringify(character), 3600);
    }
    return character ?? null;
  }

  async searchCharacters(filters: CharacterFilter): Promise<Character[]> {
    const where: any = {};
    if (filters.originLocationId) {
      where.origin_location_id = filters.originLocationId;
    }

    const characters = await Character.findAll({
      where,
      include: [
        { model: Location, as: 'originLocation' },
        { model: Location, as: 'currentLocation' }
      ]
    });
    return characters ?? null;
  }
}

export default new CharacterService();