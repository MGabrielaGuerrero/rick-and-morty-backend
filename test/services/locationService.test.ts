import LocationService from '../../src/services/LocationService';
import Location from '../../src/database/models/Location';

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

const mockLocations = [
  {
    id: 1,
    name: 'Earth (C-137)',
    type: 'Planet',
    dimension: 'Dimension C-137',
    url: 'https://rickandmortyapi.com/api/location/1',
    created: new Date(),
    residents: [1, 2],
  },
  {
    id: 2,
    name: 'Abadango',
    type: 'Cluster',
    dimension: 'Unknown',
    url: 'https://rickandmortyapi.com/api/location/2',
    created: new Date(),
    residents: [],
  },
];

describe('LocationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocationById', () => {
    it('debería devolver una ubicación por ID', async () => {
      (Location.findByPk as jest.Mock).mockResolvedValue(mockLocations[0]);

      const result = await LocationService.getLocationById(1);
      expect(result).toEqual(mockLocations[0]);
      expect(Location.findByPk).toHaveBeenCalledWith(1);
    });

    it('debería devolver null si no existe la ubicación', async () => {
      (Location.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await LocationService.getLocationById(999);
      expect(result).toBeNull();
    });
  });

  describe('getAllLocations', () => {
    it('debería devolver todas las ubicaciones', async () => {
      (Location.findAll as jest.Mock).mockResolvedValue(mockLocations);

      const result = await LocationService.getAllLocations();
      expect(result.length).toBe(2);
      expect(Location.findAll).toHaveBeenCalled();
    });
  });
});