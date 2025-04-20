import { Dialect } from 'sequelize';
import 'dotenv/config';

type DBConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
};

const config: Record<string, DBConfig> = {
  development: {
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? 'password',
    database: process.env.DB_NAME ?? 'rickandmorty',
    host: process.env.DB_HOST ?? 'db',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? 'password',
    database: process.env.DB_TEST_NAME ?? 'rickandmorty_test',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
  },
};

export default config;
