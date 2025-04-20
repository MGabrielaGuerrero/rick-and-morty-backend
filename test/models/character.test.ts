import Character from '../../src/database/models/Character';
import Location from '../../src/database/models/Location';

jest.setTimeout(5000)

describe('Modelo Character', () => {
    it('debería crear un Character con asociación a Location', async () => {
        // 1. Crear una Location
        const loc = await Location.create({
            id:200,
            name: 'Earth',
            type: 'Planet',
            dimension: 'Dimension C-137',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // 2. Crear un Character referenciando origin_location_id
        const char = await Character.create({
            id:200,
            name: 'Rick Sanchez',
            status: 'Alive',
            species: 'Human',
            type: 'null',
            gender: 'Male',
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            created: new Date(),
            episode: [1, 2, 3],
            origin_location_id: loc.id,
            current_location_id: loc.id,
            createdAt:  new Date(),
            updatedAt: new Date(),
        });

        expect(char.id).toBeGreaterThan(0);
        expect(char.origin_location_id).toBe(loc.id);

        // 3. Probar la asociación
        const fetched = await Character.findByPk(char.id, { include: ['originLocation'] });
        expect(fetched?.originLocation).toBeDefined();
        expect(fetched?.originLocation?.name).toBe('Earth');
    });
       
        

    it('debería respetar enums para status y gender', async () => {
        await expect(Character.create({
            name: 'Test',
            status: 'NotAStatus',      // valor inválido
            species: 'Alien',
            type: null,
            gender: 'unknown',
            image: '',
            created: new Date(),
            episode: [],
            origin_location_id: null,
            current_location_id: null
        }as any)).rejects.toThrow();
    });
});
