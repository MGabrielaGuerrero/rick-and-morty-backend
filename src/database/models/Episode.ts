import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface EpisodeAttributes {
  id: number;
  name: string;
  air_date: Date;
  episode: string;
  createdAt: Date;
  updatedAt: Date;
  characters?: number[]; // Relación con personajes
}

interface EpisodeCreationAttributes extends Optional<EpisodeAttributes, 'id'> {}

class Episode extends Model<EpisodeAttributes, EpisodeCreationAttributes> implements EpisodeAttributes {
  public id!: number;
  public name!: string;
  public air_date!: Date;
  public episode!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public characters?: number[]; // Relación con personajes

  // Función de inicialización
  static initModel(sequelize: Sequelize) {
    Episode.init(
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
        air_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        episode: {
          type: DataTypes.STRING(16),
          allowNull: false,
        },
        characters: {
          type: DataTypes.JSON,
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
        modelName: 'Episode',
        tableName: 'Episodes',
        timestamps: true,
      }
    );
  }

  static associate() {
   //associaciones   
  }
}

export default Episode;








