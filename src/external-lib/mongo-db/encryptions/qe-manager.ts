import { isEmpty } from '../../../shared/utils';
import { EncryptionFieldType, QEOptionType } from '../types';
import { DbEncryptionManager } from './db-encryption-manager';
import { ConfigService, Logger } from '../../../shared/abstractions';
import { ClientEncryption, ClientEncryptionDataKeyProvider, MongoClient } from 'mongodb';

interface IEncryptionCollectionOption {
  provider: ClientEncryptionDataKeyProvider;
  createCollectionOptions: {
    encryptedFields: { fields: any[] };
  };
  masterKey: {
    key: string;
    region: string;
  };
}

export class QEManager {
  constructor(
    private dbEncryptionManager: DbEncryptionManager,
    private configService: ConfigService,
    private logger: Logger
  ) {}

  private getAutoCollectionEncryptionConfig(fields: QEOptionType[]): IEncryptionCollectionOption {
    const dbEncryptionConfig = this.configService.mongoDbEncryption;

    return {
      provider: 'aws',
      createCollectionOptions: { encryptedFields: { fields } },
      masterKey: {
        key: dbEncryptionConfig?.aws?.keyArn,
        region: dbEncryptionConfig?.aws?.region,
      },
    };
  }

  /**
   * This function is only applicable to new collections. Existing collections are ignored since Queryable Encryption have limitation on modifying existing collection.
   * In order to apply Queryable Encryption, the collection must be dropped first with all it's dependencies and then created again with proper encryption fields
   *
   * @param mongoClient mongo client
   * @param encryptedFieldsMapForQE encrypted fields map for Queryable Encryption
   * @param autoEncryptionOptions auto-encryption options
   */
  async handleQE(
    mongoClient: MongoClient,
    encryptedFieldsMapForQE: Record<string, EncryptionFieldType>,
    autoEncryptionOptions: any
  ) {
    const dbInstance = mongoClient.db(this.configService.mongoDb.dbName);

    const clientEncryption = new ClientEncryption(mongoClient, autoEncryptionOptions);
    if (!isEmpty(encryptedFieldsMapForQE)) {
      // Check if the collection exists
      const existingCollectionNames = await dbInstance
        .listCollections()
        .toArray()
        .then(list => list?.map(x => x.name));

      await Promise.all(
        Object.entries(encryptedFieldsMapForQE).map(async ([key, value]) => {
          const collectionName = key.split('.')[1]!;

          if (!existingCollectionNames.includes(collectionName)) {
            try {
              // start-create-encrypted-collection
              await clientEncryption.createEncryptedCollection(
                dbInstance,
                collectionName,
                this.getAutoCollectionEncryptionConfig(value.fields)
              );

              this.logger.debug(
                `MongoDB collection with encrypted fields created! - ${collectionName}`
              );
              // end-create-encrypted-collection
            } catch (err) {
              throw new Error(
                `Unable to create encrypted MongoDB collection due to the following error: ${err}`
              );
            }
          }
        })
      );
    }
  }

  /**
   * This function is only restart all the collections.
   *
   * WARNING: This restartQE() function will delete existing collections and all the DEK keys used for QE
   *
   *
   * @param mongoClient mongo client
   * @param encryptedFieldsMapForQE encrypted fields map for Queryable Encryption
   * @param autoEncryptionOptions auto-encryption options
   */
  async restartQE(
    mongoClient: MongoClient,
    encryptedFieldsMapForQE: Record<string, EncryptionFieldType>,
    autoEncryptionOptions: any
  ) {
    const dbInstance = mongoClient.db(this.configService.mongoDb.dbName);

    const clientEncryption = new ClientEncryption(mongoClient, autoEncryptionOptions);
    if (!isEmpty(encryptedFieldsMapForQE)) {
      // Remove all the existing DEKs used for QE
      const keyVaultClient = this.dbEncryptionManager.getKeyVault(dbInstance);
      const dek = await keyVaultClient.findOne(
        {
          keyAltNames: this.configService.mongoDbEncryption.vault?.dataKeyName,
        },
        { projection: { _id: 1 } }
      );

      // Check if the collection exists
      const [existingCollectionNames] = await Promise.all([
        dbInstance
          .listCollections()
          .toArray()
          .then(list => list?.map(x => x.name)),
        keyVaultClient.deleteMany({ _id: { $ne: dek?._id } }),
      ]);

      await Promise.all(
        Object.entries(encryptedFieldsMapForQE).map(async ([key, value]) => {
          const collectionName = key.split('.')[1]!;

          // have to drop existing collection
          if (existingCollectionNames.includes(collectionName)) {
            await Promise.all([
              dbInstance?.dropCollection(collectionName),
              await dbInstance?.dropCollection(`enxcol_.${collectionName}.ecoc`),
              await dbInstance?.dropCollection(`enxcol_.${collectionName}.esc`),
            ]);
          }

          try {
            // start-create-encrypted-collection
            await clientEncryption.createEncryptedCollection(
              dbInstance,
              collectionName,
              this.getAutoCollectionEncryptionConfig(value.fields)
            );
            this.logger.debug(`Collection with encrypted fields created! - ${collectionName}`);
            // end-create-encrypted-collection
          } catch (err) {
            throw new Error(
              `Unable to create encrypted collection due to the following error: ${err}`
            );
          }
        })
      );
    }
  }
}
