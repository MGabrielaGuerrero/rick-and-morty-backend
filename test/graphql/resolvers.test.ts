import resolvers from '../../src/graphql/resolvers';
import CharacterService from '../../src/services/CharacterService';

jest.mock('../../src/services/CharacterService');


jest.setTimeout(5000)

describe('Resolvers - Query.characters', () => {
  const mockContext = { isAuthenticated: true };

  const mockCharacters = [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin_location_id: 1,
      current_location_id: 2
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin_location_id: 1,
      current_location_id: 2
    },
    {
      id: 3,
      name: 'Summer Smith',
      status: 'Alive',
      species: 'Human',
      gender: 'Female',
      origin_location_id: 3,
      current_location_id: 2
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const charactersResolver = (resolvers.Query as {
    characters: Function
  }).characters;;

  it('debe devolver todos los personajes sin filtros', async () => {
    (CharacterService.searchCharacters as jest.Mock).mockResolvedValue(mockCharacters);

    const result = await charactersResolver(null, {}, mockContext);

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Rick Sanchez');
  });

  it('debe filtrar por nombre', async () => {
    (CharacterService.searchCharacters as jest.Mock).mockResolvedValue(mockCharacters);

    const result = await charactersResolver(null, { filter: { name: 'Rick' } }, mockContext);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Rick Sanchez');
  });

  it('debe filtrar por species y gender', async () => {
    (CharacterService.searchCharacters as jest.Mock).mockResolvedValue(mockCharacters);

    const result = await charactersResolver(null, {
      filter: { species: 'Human', gender: 'Female' }
    }, mockContext);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Summer Smith');
  });

  it('debe lanzar error si no está autenticado', async () => {
    await expect(
      charactersResolver(null, {}, { isAuthenticated: false })
    ).rejects.toThrow('Unauthorized');
  });
});

