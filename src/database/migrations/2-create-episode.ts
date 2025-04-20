import { QueryInterface, DataTypes } from 'sequelize';

export async function up(query: QueryInterface) {
  await query.createTable('Episodes', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    air_date: { type: DataTypes.DATE, allowNull: false },
    episode: { type: DataTypes.STRING(16), allowNull: false },
    created: { type: DataTypes.DATE, allowNull: false },
    characters: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down(query: QueryInterface) {
  await query.dropTable('Episodes');
}

