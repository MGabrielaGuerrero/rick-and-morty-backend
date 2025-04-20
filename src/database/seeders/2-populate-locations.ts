import { QueryInterface } from 'sequelize';
import axios from 'axios';

interface LocationAPI {
  id: number;
  name: string;
  type: string;
  dimension: string;
  created: Date;
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
        characters(page: 1) {
          results {
            origin {
              id
              name
              type
              dimension
              created
            }
            location {
              id
              name
              type
              dimension
              created
            }
          }
        }
      }
    `
  });

  const map = new Map<number, LocationAPI>();
  interface Character {
    origin: LocationAPI | null;
    location: LocationAPI | null;
  }

  interface GraphQLResponse {
    data: {
      characters: {
        results: Character[];
      };
    };
  }

  const results: Character[] = (data as GraphQLResponse).data.characters.results.slice(0, 15);

  results.forEach((c: Character) => {
    [c.origin, c.location].forEach((loc: LocationAPI | null) => {
      if (loc && !map.has(loc.id)) {
        map.set(loc.id, {
          id: loc.id,
          name: loc.name,
          type: loc.type,
          dimension: loc.dimension,
          created: new Date(loc.created),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
  });

  await queryInterface.bulkInsert('Locations', Array.from(map.values()));
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('Locations', {});
}







