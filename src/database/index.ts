import { Sequelize } from 'sequelize';
import config from './config/config'; 
import Character from './models/Character';
import Location from './models/Location';
import Episode from './models/Episode';


const env = process.env.NODE_ENV ?? 'development';
const dbConfig = config[env];
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: false, // opcional
  }
);

// init models
Character.initModel(sequelize);
Location.initModel(sequelize);
Episode.initModel(sequelize);

// asociaciones
Character.associate();


export default sequelize;



