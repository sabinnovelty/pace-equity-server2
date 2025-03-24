import * as dotenv from '@dotenvx/dotenvx';
import { Injectable } from '@nestjs/common';
import { validateConfig } from '../shared/utils';
import { configSchema, IEnvConfig } from './schema';
import { ConfigService } from '../shared/abstractions/config-service';
import {
  IAppConfig,
  IAuthConfig,
  IDbConfig,
  IDbEncryptionConfig,
  IRedisConfig,
  IStorageConfig,
} from './type';

@Injectable()
export class ConfigServiceImpl implements ConfigService {
  private _envData: IEnvConfig;

  constructor() {
    this._envData = validateConfig<IEnvConfig>(this._parsedEnv, configSchema);
  }

  get app(): IAppConfig {
    return {
      env: this._envData.ENV,
      isDebug: this._envData.DEBUG,
      port: this._envData.SERVER_PORT,
    };
  }

  get auth(): IAuthConfig {
    return {
      authTokenSecret: this._envData.AUTH_TOKEN_SECRET,
      cookieSecret: this._envData.COOKIE_SECRET,
    };
  }

  get postgres(): IDbConfig {
    return {
      port: this._envData.DB_PORT,
      dbName: this._envData.DB_NAME,
      username: this._envData.DB_USERNAME,
      password: this._envData.DB_PASSWORD,
      host: this._envData.DB_HOST,
    };
  }

  get mongoDbEncryption(): IDbEncryptionConfig {
    throw new Error('Method not implemented.');
  }

  get s3(): IStorageConfig {
    throw new Error('Method not implemented.');
  }

  get redis(): IRedisConfig {
    return {
      port: this._envData.REDIS_PORT,
      host: this._envData.REDIS_HOST,
      username: this._envData.REDIS_USERNAME,
      password: this._envData.REDIS_PASSWORD,
    };
  }

  private get _parsedEnv() {
    return { ...dotenv.config().parsed };
  }
}
