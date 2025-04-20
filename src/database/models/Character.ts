import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import Location from './Location';
import Episode from './Episode';

// Definir los tipos
interface CharacterAttributes {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type?: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  image: string;
  created: Date;
  origin_location_id?: number;
  current_location_id?: number;
  episode: number[];
  createdAt: Date;
  updatedAt: Date;
}

interface CharacterCreationAttributes extends Optional<CharacterAttributes, 'id'> { }

// La clase del modelo
class Character extends Model<CharacterAttributes, CharacterCreationAttributes> implements CharacterAttributes {
  public id!: number;
  public name!: string;
  public status!: 'Alive' | 'Dead' | 'unknown';
  public species!: string;
  public type?: string;
  public gender!: 'Female' | 'Male' | 'Genderless' | 'unknown';
  public image!: string;
  public created!: Date;
  public origin_location_id?: number;
  public current_location_id?: number;
  public episode!: number[];
  public createdAt!: Date;
  public updatedAt!: Date;

  // Relaciones
  public originLocation?: Location;
  public currentLocation?: Location;
  public episodes?: Episode[];

  // Función estática para la inicialización y las relaciones
  static associate() {
    Character.belongsTo(Location, { as: 'originLocation', foreignKey: 'origin_location_id' });
    Character.belongsTo(Location, { as: 'currentLocation', foreignKey: 'current_location_id' });
  }

  // Método de inicialización del modelo
  static initModel(sequelize: Sequelize) {
    Character.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [['Alive', 'Dead', 'unknown']],
          },
        },
        species: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        gender: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [['Female', 'Male', 'Genderless', 'unknown']],
          },
        },
        image: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        created: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        origin_location_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: 'Locations',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        current_location_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          references: {
            model: 'Locations',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        episode: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: [],
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Character',
        tableName: 'Characters',
        timestamps: true,
      }
    );
  }
}

export default Character;


