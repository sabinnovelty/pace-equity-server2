import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Config } from '.';
console.log(Config);
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: Config.DB_HOST,
  port: Number(Config.DB_PORT),
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  // Don't use this in production. Always keep false
  synchronize: false,
  logging: false,
  //   entities: ['src/entity/*.{ts,js}'],
  entities:
    Config.NODE_ENV === 'test' ? ['**/*.entity.ts'] : ['**/*.entity.js'],
  migrations: ['src/migration/*.{ts,js}'],
  subscribers: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
