import CharacterService from '../../src/services/CharacterService';
import Character from '../../src/database/models/Character';

jest.mock('../../src/database/models/Character');
jest.mock('../../src/database/models/Location');
jest.mock('../../src/services/cacheService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue(null),  // Simula caché vacía
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.setTimeout(30000)

const mockCharacters = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin_location_id: 1,
    current_location_id: 2,
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin_location_id: 2,
    current_location_id: 2,
  },
];

describe('CharacterService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCharacterById', () => {
    it('debería devolver un personaje por ID', async () => {
      (Character.findByPk as jest.Mock).mockResolvedValue(mockCharacters[0]);

      const result = await CharacterService.getCharacterById(1);
      expect(result).toEqual(mockCharacters[0]);
      expect(Character.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    });

    it('debería devolver null si el personaje no existe', async () => {
      (Character.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await CharacterService.getCharacterById(999);
      expect(result).toBeNull();
    });
  });

  describe('searchCharacters', () => {
    it('debería filtrar por originLocationId', async () => {
      (Character.findAll as jest.Mock).mockResolvedValue([mockCharacters[1]]);

      const result = await CharacterService.searchCharacters({ originLocationId: 2 });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(2);
      expect(Character.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ origin_location_id: 2 })
      }));
    });
  });
});
