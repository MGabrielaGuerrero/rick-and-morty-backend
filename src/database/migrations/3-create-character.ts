import { QueryInterface, DataTypes } from 'sequelize';

export async function up(query: QueryInterface) {
  await query.createTable('Characters', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('Alive', 'Dead', 'unknown'),
      allowNull: false,
    },
    species: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING },
    gender: {
      type: DataTypes.ENUM('Female', 'Male', 'Genderless', 'unknown'),
      allowNull: false,
    },
    image: { type: DataTypes.STRING(512), allowNull: false },
    created: { type: DataTypes.DATE, allowNull: false },
    episode: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
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
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down(query: QueryInterface) {
  await query.dropTable('Characters');
}
