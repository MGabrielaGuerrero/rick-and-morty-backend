import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface LocationAttributes {
  id: number;
  name: string;
  type?: string;
  dimension?: string;
  createdAt: Date;
  updatedAt: Date;
  residents?: { id: number }[]; // ahora con tipo correcto
}

interface LocationCreationAttributes extends Optional<LocationAttributes, 'id'> {}

class Location extends Model<LocationAttributes, LocationCreationAttributes> implements LocationAttributes {
  public id!: number;
  public name!: string;
  public type?: string;
  public dimension?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public residents?: { id: number }[]; // <-- campo virtual

  static initModel(sequelize: Sequelize) {
    Location.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        dimension: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        residents: {
          type: DataTypes.VIRTUAL,
          get() {
            return this.getDataValue('residents');
          },
          set(value: { id: number }[]) {
            this.setDataValue('residents', value);
          }
        }
      },
      {
        sequelize,
        modelName: 'Location',
        tableName: 'Locations',
        timestamps: true,
      }
    );
  }

  static associate() {
    // asociaciones aquí si más adelante relacionas con Character
  }
}

export default Location;
