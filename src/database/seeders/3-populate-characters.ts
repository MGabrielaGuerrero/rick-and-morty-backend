import { QueryInterface } from 'sequelize';
import axios from 'axios';

// Definimos un tipo para los personajes que se reciben desde la API
interface CharacterAPI {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string | null;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  image: string;
  url: string;
  created: string;
  origin: { id: number } | null;
  location: { id: number } | null;
  episode: Array<{ id: number }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  if (!process.env.GRAPHQL_URL) {
    throw new Error('GRAPHQL_URL is not defined in the environment variables.');
  }
  const { data } = await axios.post(process.env.GRAPHQL_URL, {
    query: `
      query {
      characters(page: 1) {
        info {
          count
        }
        results {
          id,
          name,
          status,
          species,
          type,
          gender,
          image,
          created,
          origin { id },
          location { id },
          episode { id }
        }
      }
  }
    `
  });


  const chars: CharacterAPI[] = data.data.characters.results.slice(0, 15);

  const recordsCharacters = chars.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    species: c.species,
    type: c.type ?? null,
    gender: c.gender,
    image: c.image,
    created: new Date(c.created),
    episode: JSON.stringify(c.episode.map((ep) => Number(ep.id))), // guarda array de IDs en JSON
    origin_location_id: c.origin?.id ? Number(c.origin.id) : null,
    current_location_id: c.location?.id ? Number(c.location.id) : null,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  await queryInterface.bulkInsert('Characters', recordsCharacters);

};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkDelete('Characters', {});
  await queryInterface.bulkDelete('Episodes', {});
  await queryInterface.bulkDelete('Locations', {});
};



