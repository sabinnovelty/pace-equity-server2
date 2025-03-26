import z from 'zod';
import { Environment } from '../shared/enum';
import { stringBooleanSchema } from '../shared/validations';

export const mongodbSchema = z.object({
  MONGO_DB_NAME: z.string(),
  MONGO_USERNAME: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_CLUSTER_NAME: z.string(),
  MONGO_DB_PROTOCOL: z.enum(['mongodb', 'mongodb+srv']),
  MONGO_DB_PORT: z.string().pipe(z.coerce.number()).optional(),
});

export const postgresSchema = z.object({
  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  // MONGO_CLUSTER_NAME: z.string(),
  // MONGO_DB_PROTOCOL: z.enum(['mongodb', 'mongodb+srv']),
  DB_PORT: z.string().pipe(z.coerce.number()).optional(),
});

export const mongodbEncryptionSchema = z.object({
  AWS_REGION: z.string(),
  AWS_KEY_ARN: z.string(),
  AWS_ACCESS_KEY: z.string(),

  AWS_SECRET_KEY: z.string(),
  KEY_VAULT_DATA_KEY_NAME: z.string(),
  KEY_VAULT_COLLECTION_NAME: z.string(),
  MONGO_AUTO_ENCRYPTION_SHARED_LIB_PATH: z.string().optional(),
});

export const s3Schema = z.object({
  S3_REGION: z.string(),
  S3_BUCKET_URL: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
});

export const redisSchema = z.object({
  REDIS_HOST: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_PORT: z.string().pipe(z.coerce.number()),
});
console.log('ENV---', Environment);
export const appSchema = z.object({
  ENV: z.nativeEnum(Environment),
  DEBUG: stringBooleanSchema.optional(),
  SERVER_PORT: z.string().pipe(z.coerce.number()),
});

export const configSchema = z
  .object({ AUTH_TOKEN_SECRET: z.string(), COOKIE_SECRET: z.string() })
  .merge(appSchema)
  .merge(postgresSchema)
  .merge(redisSchema);

export type IEnvConfig = z.infer<typeof configSchema>;
