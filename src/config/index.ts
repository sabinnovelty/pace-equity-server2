import { config } from 'dotenv';
import * as path from 'path'; // Ensure the path module is imported

config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const { NODE_ENV, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } =
  process.env;

export const Config = {
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
};
