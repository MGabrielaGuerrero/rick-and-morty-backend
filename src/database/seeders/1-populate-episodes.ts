import { QueryInterface } from 'sequelize';
import axios from 'axios';

interface EpisodeAPI {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  created: string;
  characters: Array<{ id: number }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function up(queryInterface: QueryInterface) {
  if (!process.env.GRAPHQL_URL) {
    throw new Error('GRAPHQL_URL is not defined in the environment variables.');
  }
  const { data } = await axios.post(process.env.GRAPHQL_URL, {
    query: `
      query {
        episodesByIds(ids: [${Array.from({ length: 100 }, (_, i) => i + 1).join(',')}]) {
          id
          name
          air_date
          episode
          created
          characters {
            id
          }
        }
      }
    `
  });

  const episodes: EpisodeAPI[] = data.data.episodesByIds

  const records = episodes.map((e) => ({
    id: e.id,
    name: e.name,
    air_date: new Date(e.air_date),
    episode: e.episode,
    created: new Date(e.created),
    characters: JSON.stringify(e.characters.map((ch) => ch.id)),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await queryInterface.bulkInsert('Episodes', records);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('Episodes', {});
}



