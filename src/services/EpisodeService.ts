import axios from 'axios';
import CacheService from './cacheService';
import Episode from '../database/models/Episode';

interface EpisodeAPI {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  url: string;
  created: string;
  characters: { id: number }[];
}

/**
 * Servicio para manejar lógica de episodios:
 * - Sincronización desde la API externa
 * - Lectura de DB con caché en Redis
 */
class EpisodeService {
  private cache = CacheService;
  private readonly allKey = 'episodes:all';

  /**
   * Sincroniza todos los episodios de la API externa a la base de datos.
   */
  async syncEpisodes(): Promise<void> {
    let page = 1;
    const episodesAPI: EpisodeAPI[] = [];
    if (!process.env.GRAPHQL_URL) {
      throw new Error('GRAPHQL_URL is not defined in the environment variables.');
    }
    while (true) {
      const response = await axios.post(process.env.GRAPHQL_URL, {
        query: `
        query getEpisodes($page: Int!) { 
          episodes(page: $page) {
          info { next }
          results{
          id
          air_date
          name
          episode
          created
          characters {
            id
          }
          }
        }
    }`, variables: { page }
      });

      const body = response.data.data.episodes;
      episodesAPI.push(...body.results);
      if (!body.info.next) break;
      page = body.info.next;
    }

    // Inserta o actualiza cada episodio
    for (const e of episodesAPI) {
      await Episode.upsert({
        id: e.id,
        name: e.name,
        air_date: new Date(e.air_date),
        episode: e.episode,
        characters: e.characters.map(ch => ch.id),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Invalidar caché de lista completa
    await this.cache.del(this.allKey);
  }

  /**
   * Recupera todos los episodios de caché o DB.
   */
  async getAllEpisodes(): Promise<Episode[]> {
    const cached = await this.cache.get(this.allKey);
    if (cached) {
      return JSON.parse(cached) as Episode[];
    }

    let episodes = await Episode.findAll();
    if (episodes.length === 0) {
      await this.syncEpisodes();
      episodes = await Episode.findAll();
    }
    await this.cache.set(this.allKey, JSON.stringify(episodes), 3600);
    return episodes ?? null;
  }

  /**
   * Recupera un episodio por ID de caché o DB.
   */
  async getEpisodeById(ids: Array<number>): Promise<Episode | null> {
    const id = ids[0]
    const key = `episode:${id}`;
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached) as Episode;
    }

    let episode = await Episode.findByPk(Number(id));
    if (!episode) {
      await this.syncEpisodes();
      episode = await Episode.findByPk(Number(id));
    }
    if (episode) {
      await this.cache.set(key, JSON.stringify(episode), 3600);
    }
    return episode ?? null;
  }
}

export default new EpisodeService();