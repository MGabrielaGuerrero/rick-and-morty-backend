import { IResolvers } from '@graphql-tools/utils';
import { GraphQLResolveInfo } from 'graphql';
import CharacterService from '../services/CharacterService';
import LocationService from '../services/LocationService';
import EpisodeService from '../services/EpisodeService';

const PAGE_SIZE = 20;

interface Context {
  isAuthenticated: boolean;
  [key: string]: any;
}

type ResolverFn = (
  parent: any,
  args: any,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<any>;

// ✅ Decorador tipo función que registra el tiempo de ejecución
function logExecutionTime(fn: ResolverFn, name: string): ResolverFn {
  return async function (parent, args, context, info) {
    const start = Date.now();
    console.log(` Executing ${name} with args:, args`);

    try {
      const result = await fn(parent, args, context, info);
      const duration = Date.now() - start;
      console.log(` [${name}] Terminado en ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(` ${name} failed after ${duration}ms, error`);
      throw error;
    }
  };
}

const requireAuth = (context: Context) => {
  if (!context.isAuthenticated) {
    throw new Error('Unauthorized');
  }
};

const resolvers: IResolvers = {
  Query: {
    characters: logExecutionTime(async (_parent, args, context) => {
      requireAuth(context);
      const { page = 1, filter = {} } = args;
      const originFiltro = filter.originLocationId
        ? { originLocationId: filter.originLocationId }
        : {};
      let list = await CharacterService.searchCharacters(originFiltro);

      if (filter.name) {
        const term = filter.name.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(term));
      }
      if (filter.status) {
        list = list.filter(c => c.status === filter.status);
      }
      if (filter.species) {
        const term = filter.species.toLowerCase();
        list = list.filter(c => c.species.toLowerCase().includes(term));
      }
      if (filter.gender) {
        list = list.filter(c => c.gender === filter.gender);
      }

      const startIndex = (page - 1) * PAGE_SIZE;
      return list.slice(startIndex, startIndex + PAGE_SIZE);
    }, 'characters'),

    character: logExecutionTime(async (_parent, args, context) => {
      requireAuth(context);
      return await CharacterService.getCharacterById(args.id);
    }, 'character'),

    locations: logExecutionTime(async (_parent, _args, context) => {
      requireAuth(context);
      return await LocationService.getAllLocations();
    }, 'locations'),

    location: logExecutionTime(async (_parent, args, context) => {
      requireAuth(context);
      return await LocationService.getLocationById(args.id);
    }, 'location'),

    episodes: logExecutionTime(async (_parent, _args, context) => {
      requireAuth(context);
      return await EpisodeService.getAllEpisodes();
    }, 'episodes'),

    episodesByIds: logExecutionTime(async (_parent, args, context) => {
      requireAuth(context);
      return await EpisodeService.getEpisodeById(args.ids);
    }, 'episode'),
  },

  Character: {
    originLocation: logExecutionTime(async (parent, _args, context) => {
      requireAuth(context);
      const id = parent.origin_location_id;
      return id ? await LocationService.getLocationById(id) : null;
    }, 'originLocation'),

    currentLocation: logExecutionTime(async (parent, _args, context) => {
      requireAuth(context);
      const id = parent.current_location_id;
      return id ? await LocationService.getLocationById(id) : null;
    }, 'currentLocation'),
  },
};

export default resolvers;


