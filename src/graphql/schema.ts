import { gql } from 'apollo-server-express';

const typeDefs = gql `
  scalar Date

  """Una ubicación en el universo de Rick and Morty"""
  type Location {
    id: ID!
    name: String!
    type: String
    dimension: String
    created: Date
    residents: [Int]
  }

  """Un personaje del universo de Rick and Morty"""
  type Character {
    id: ID!
    name: String!
    status: String!
    species: String!
    type: String
    gender: String!
    image: String!
    created: Date!
    originLocation: Location
    currentLocation: Location
    episode: [Int!]!
  }

  """Un episodio de la serie Rick and Morty"""
  type Episode {
    id: ID!
    name: String!
    air_date: Date!
    episode: String!
    created: Date
    characters: [Int]
  }

  """Filtros para buscar personajes"""
  input CharacterFilterInput {
    name: String
    status: String
    species: String
    gender: String
    originLocationId: Int
  }

  type Query {
    """Lista de personajes paginada y filtrable"""
    characters(page: Int = 1, filter: CharacterFilterInput): [Character!]!

    """Personaje por ID"""
    character(id: Int!): Character

    """Todas las ubicaciones"""
    locations: [Location!]!

    """Ubicación por ID"""
    location(id: Int!): Location

    """Todos los episodios"""
    episodes: [Episode!]!

    """Episodio por ID"""
    episodesByIds(ids: [Int!]): Episode
  }
`;


export default typeDefs;


  