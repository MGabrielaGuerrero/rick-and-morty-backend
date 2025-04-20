
import EpisodeService from '../../src/services/EpisodeService';
import Episode from '../../src/database/models/Episode';

jest.mock('../../src/database/models/Episode');
jest.mock('../../src/services/cacheService', () => ({
    __esModule: true,
    default: {
      get: jest.fn().mockResolvedValue(null),  // Simula caché vacía
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    },
  }));

const mockEpisodes = [
  {
    id: 1,
    name: 'Pilot',
    air_date: new Date('2017-12-02'),
    episode: 'S01E01',
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: new Date(),
    characters: [1, 2],
  },
  {
    id: 2,
    name: 'Lawnmower Dog',
    air_date: new Date('2017-12-09'),
    episode: 'S01E02',
    url: 'https://rickandmortyapi.com/api/episode/2',
    created: new Date(),
    characters: [1],
  },
];

describe('EpisodeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEpisodeById', () => {
    it('debería devolver un episodio por ID', async () => {
      (Episode.findByPk as jest.Mock).mockResolvedValue(mockEpisodes[0]);

      const result = await EpisodeService.getEpisodeById([1]);
      expect(result).toEqual(mockEpisodes[0]);
      expect(Episode.findByPk).toHaveBeenCalledWith(1);
    });

    it('debería devolver null si no existe el episodio', async () => {
      (Episode.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await EpisodeService.getEpisodeById([999]);
      expect(result).toBeNull();
    });
  });

  describe('getAllEpisodes', () => {
    it('debería devolver todos los episodios', async () => {
      (Episode.findAll as jest.Mock).mockResolvedValue(mockEpisodes);

      const result = await EpisodeService.getAllEpisodes();
      expect(result.length).toBe(2);
      expect(Episode.findAll).toHaveBeenCalled();
    });
  });
});