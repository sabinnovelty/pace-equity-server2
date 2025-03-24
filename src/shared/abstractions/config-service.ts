import {
  IAppConfig,
  IAuthConfig,
  IDbConfig,
  IDbEncryptionConfig,
  IRedisConfig,
  IStorageConfig,
} from '../../config/type';

export abstract class ConfigService {
  abstract get app(): IAppConfig;
  abstract get auth(): IAuthConfig;
  // abstract get mongoDb(): IDbConfig;
  abstract get postgres(): IDbConfig;
  abstract get mongoDbEncryption(): IDbEncryptionConfig;
  abstract get s3(): IStorageConfig;
  abstract get redis(): IRedisConfig;
}
