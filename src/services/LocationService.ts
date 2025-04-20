import axios from 'axios';
import CacheService from './cacheService';
import Location from '../database/models/Location';

interface LocationAPI {
  id: number;
  name: string;
  type: string;
  dimension: string;
  url: string;
  created: string;
  residents: { id: number }[];
}

/**
 * Servicio para manejar lógica de ubicaciones:
 * - Sincronización desde la API externa
 * - Lectura de DB con caché en Redis
 */
class LocationService {
  private cache = CacheService;
  private readonly allKey = 'locations:all';

  async syncLocations(): Promise<void> {
    let page = 1;
    const locationsAPI: LocationAPI[] = [];
    if (!process.env.GRAPHQL_URL) {
      throw new Error('GRAPHQL_URL is not defined in the environment variables.');
    }
    while (true) {
      const response = await axios.post(process.env.GRAPHQL_URL, {
        query: `
      query getLocations($page: Int!)  {
          locations(page: $page) {
          info { next }
            results {
              id
              name
              type
              dimension
              created
              residents {
                id
              }
            }
    } }`, variables: { page }
      });
      const body = response.data.data.locations;
      locationsAPI.push(...body.results);
      if (!body.info.next) break;
      page = body.info.next;
    }

    for (const loc of locationsAPI) {
      await Location.upsert({
        id: loc.id,
        name: loc.name,
        type: loc.type,
        dimension: loc.dimension,
        residents: loc.residents.map(r => ({ id: r.id })),
        createdAt: new Date(loc.created),
        updatedAt: new Date(loc.created),
      });
    }

    await this.cache.del(this.allKey);

  }

  async getAllLocations(): Promise<Location[]> {
    const cached = await this.cache.get(this.allKey);
    if (cached) {
      return JSON.parse(cached) as Location[];
    }

    let locations = await Location.findAll();
    if (locations.length === 0) {
      await this.syncLocations();
      locations = await Location.findAll();
    }
    await this.cache.set(this.allKey, JSON.stringify(locations), 3600);
    return locations ?? null;
  }

  async getLocationById(id: number): Promise<Location | null> {
    const key = `location:${id}`;
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached) as Location;
    }

    let location = await Location.findByPk(id);
    if (!location) {
      await this.syncLocations();
      location = await Location.findByPk(id);
    }
    if (location) {
      await this.cache.set(key, JSON.stringify(location), 3600);
    }
    return location ?? null;
  }
}

export default new LocationService();