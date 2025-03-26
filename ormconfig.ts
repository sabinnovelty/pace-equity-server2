import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();
console.log(process.env.DB_HOST);
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, 'src/**/*-schema.{ts,js}')],
  migrations: [path.join(__dirname, 'src/database/migrations/*.{ts,js}')],
};

export const AppDataSource = new DataSource(dataSourceOptions);
export default dataSourceOptions;
