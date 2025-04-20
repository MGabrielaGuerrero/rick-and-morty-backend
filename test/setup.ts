import { Sequelize } from 'sequelize';
import { readdirSync } from 'fs';
import path from 'path';

export const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
});

// Importa todos los modelos
const modelsDir = path.resolve(__dirname, '../src/database/models');
readdirSync(modelsDir)
  .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
  .forEach(f => {
    const modelModule = require(path.join(modelsDir, f));
    const model = modelModule.default;

    if (model && typeof model.initModel === 'function') {
      model.initModel(sequelize);
    }
  });


Object.values(sequelize.models).forEach((model: any) => {
  if (typeof model.associate === 'function') {
    model.associate(sequelize.models);
  } else {
    console.warn(`Model ${model.name} has no associate method`);
  }
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
