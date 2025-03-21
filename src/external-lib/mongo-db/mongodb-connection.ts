import { isEmpty } from 'lodash';
import { Db, MongoClient } from 'mongodb';
import { sleep } from '../../shared/utils';
import { Injectable } from '@nestjs/common';
import { EncryptionFieldType } from './types';
import { IDbConfig } from '../../config/type';
import { QEManager } from './encryptions/qe-manager';
import { CSFLEManager } from './encryptions/csfle-manager';
import { ConfigService, Logger } from '../../shared/abstractions';
import { DbEncryptionManager } from './encryptions/db-encryption-manager';

@Injectable()
export class MongoConnection {
  public mongoClient?: MongoClient;
  public dbInstance?: Db;
  public watchDbInstance?: Db;
  private retryCount = 0;

  constructor(
    private configService: ConfigService,
    private csfleManager: CSFLEManager,
    private dbEncryptionManager: DbEncryptionManager,
    private qeManager: QEManager,
    private logger: Logger
  ) {}

  async init(encryptedFieldsMap?: Record<string, EncryptionFieldType>): Promise<Db> {
    try {
      const dbConfigs = this.configService.mongoDb;
      const url = resolveURI(dbConfigs);
      let autoEncryptionOptions = isEmpty(encryptedFieldsMap)
        ? undefined
        : this.dbEncryptionManager.getAutoEncryptionConfig();

      //Filter collections based on CSFLE and QE
      const { encryptedFieldsMapForQE, encryptedFieldsMapForCSFLE } =
        this.dbEncryptionManager.segregateInUseFieldsMap(encryptedFieldsMap);

      // HANDLE CSFLE ENCRYPTION
      if (autoEncryptionOptions && !isEmpty(encryptedFieldsMapForCSFLE)) {
        const keyId = await this.csfleManager.fetchKeyId(url, dbConfigs.dbName);
        autoEncryptionOptions = {
          ...autoEncryptionOptions,
          schemaMap: this.csfleManager.getSchemaMap(encryptedFieldsMapForCSFLE, keyId),
        };
      }

      this.mongoClient = new MongoClient(url, {
        autoEncryption: autoEncryptionOptions,
      });

      this.dbInstance = this.mongoClient?.db(dbConfigs.dbName);

      await this.mongoClient.connect();
      this.logger.info('Connected to MongoDB successfully!');

      // HANDLE QE ENCRYPTION
      if (autoEncryptionOptions && !isEmpty(encryptedFieldsMapForQE)) {
        await this.qeManager.handleQE(
          this.mongoClient!,
          encryptedFieldsMapForQE,
          autoEncryptionOptions
        );
      }

      this.watchDbInstance = new MongoClient(url)?.db(dbConfigs.dbName);

      return this.dbInstance;
    } catch (error: any) {
      this.mongoClient?.close();

      this.logger.info(`Could not connect to MongoDB at attempt: ${this.retryCount + 1}`);
      this.logger.error(error?.message, error);

      if (this.retryCount < 5) {
        this.retryCount++;
        await sleep(5000);

        this.logger.info('Retrying MongoDB connection');

        return await this.init(encryptedFieldsMap);
      } else {
        this.logger.error('Could not connect to MongoDB.', error as any);
        process.exit(1);
      }
    }
  }
}

function resolveURI(mongoDbConfig: IDbConfig) {
  const clusterName = mongoDbConfig.host;
  const userName = encodeURIComponent(mongoDbConfig.username);
  const password = encodeURIComponent(mongoDbConfig.password);

  let connectionString = `${mongoDbConfig.protocol}://${userName}:${password}@${clusterName}`;
  if (mongoDbConfig.protocol === ' mongodb' && mongoDbConfig.port) {
    connectionString += `:${mongoDbConfig.port}`;
  }
  connectionString += '/?retryWrites=true&w=majority';

  return connectionString;
}
