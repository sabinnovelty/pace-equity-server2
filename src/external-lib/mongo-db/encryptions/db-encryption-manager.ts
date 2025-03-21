/* eslint-disable indent */
import { Injectable } from '@nestjs/common';
import { EncryptionFieldType } from '../types';
import { isEmpty } from '../../../shared/utils';
import { AutoEncryptionOptions, Db } from 'mongodb';
import { ConfigService } from '../../../shared/abstractions';

@Injectable()
export class DbEncryptionManager {
  constructor(private configService: ConfigService) {}
  getAutoEncryptionConfig(): AutoEncryptionOptions | any | undefined {
    const dbName = this.configService.mongoDb.dbName;
    const dbEncryptionConfig = this.configService.mongoDbEncryption;

    if (dbEncryptionConfig) {
      return {
        keyVaultNamespace: `${dbName}.${dbEncryptionConfig?.vault?.collectionName}`,
        kmsProviders: {
          aws: {
            accessKeyId: dbEncryptionConfig?.aws?.accessKey,
            secretAccessKey: dbEncryptionConfig?.aws?.secretKey,
          },
        },
        ...(dbEncryptionConfig?.vault?.sharedLibPath
          ? {
              sharedLibraryPathOptions: {
                cryptSharedLibPath: dbEncryptionConfig?.vault?.sharedLibPath,
              },
            }
          : {}),
      };
    }
  }

  segregateInUseFieldsMap(encryptedFieldsMap?: Record<string, EncryptionFieldType>) {
    const encryptedFieldsMapForCSFLE: Record<string, EncryptionFieldType> = {};
    const encryptedFieldsMapForQE: Record<string, EncryptionFieldType> = {};

    if (encryptedFieldsMap && !isEmpty(encryptedFieldsMap)) {
      Object.entries(encryptedFieldsMap)?.forEach(([key, value]) => {
        if (value) {
          if (value.inUseEncryptionType === 'CSFLE') {
            encryptedFieldsMapForCSFLE[key] = value;
          } else {
            encryptedFieldsMapForQE[key] = value;
          }
        }
      });
    }

    return { encryptedFieldsMapForQE, encryptedFieldsMapForCSFLE };
  }

  getKeyVault(dbInstance: Db) {
    return dbInstance.collection(this.configService?.mongoDbEncryption?.vault?.collectionName);
  }
}
