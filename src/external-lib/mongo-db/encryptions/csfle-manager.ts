/* eslint-disable indent */
import { isArray } from 'lodash';
import { MongoClient } from 'mongodb';
import DbAlgorithm from './db-algorithm';
import { Injectable } from '@nestjs/common';
import { instanceOfT } from '../../../shared/utils';
import { ConfigService } from '../../../shared/abstractions';
import { DbEncryptionManager } from './db-encryption-manager';
import { CSFLEOptionType, EncryptionFieldType } from '../types';

interface IEncryptionOption {
  keyId: any;
  algorithm: DbAlgorithm;
}

type NestedFieldType = { path: string; subFields: NestedFieldType[] } | CSFLEOptionType;

@Injectable()
export class CSFLEManager {
  private UNSUPPORTED_BSON_TYPE_FOR_RANDOM_ALGORITHM = [
    'array',
    'object',
    'bool',
    'double',
    'decimal',
  ];

  constructor(
    private dbEncryptionManager: DbEncryptionManager,
    private configService: ConfigService
  ) {}

  /**
   *
   * encryptionField:
   *
   * {
   *
   *    [dbName.collection1]: {
   *
   *      bsonType: 'object',
   *
   *      encryptMetadata: {keyId: [binary]; algorithm},
   *
   *      properties:{ a: { encrypt: {bsonType: 'string' | 'int' | 'array'}}}}
   *
   * }
   * @param dbName Database Name
   * @param options Binary Key and algorithm
   * @returns Collection Encryption Schemas
   */
  getSchemaMap = (
    encryptedFieldsModelMap: Record<string, EncryptionFieldType>,
    keyId: any,
    algorithm: DbAlgorithm = DbAlgorithm.DETERMINISTIC
  ): any => {
    // const encryptionOption: IEncryptionOption = { keyId: [this.buildKeyId()], algorithm };
    const encryptionOption: IEncryptionOption = { algorithm, keyId: [keyId] };

    const jsonSchema: any = {};
    Object.keys(encryptedFieldsModelMap).forEach(collectionName => {
      const collectionSchema = {
        properties: {},
        bsonType: 'object',
        encryptMetadata: encryptionOption,
      };
      // reformat the encryptionFields
      this.buildProperties(
        collectionSchema.properties,
        this.parseNestedEncryptionData(encryptedFieldsModelMap[collectionName]!.fields)
      );
      jsonSchema[collectionName] = collectionSchema;
    });

    return jsonSchema;
  };

  /**
   * The function fetchKeyId fetches the key ID from a key vault in a MongoDB database using a provided
   * URL and database name.
   * @param {string} url - The `url` parameter is a string that represents the connection URL for the
   * MongoDB server. It typically includes the protocol (e.g., "mongodb://"), hostname, port number, and
   * optional authentication credentials.
   * @param {string} dbName - The `dbName` parameter is a string that represents the name of the database
   * you want to fetch the key ID from.
   * @returns the `_id` property of the `dek` object.
   */
  async fetchKeyId(url: string, dbName: string) {
    const dbEncryptionConfig = this.configService.mongoDbEncryption;

    const unencryptedClient = new MongoClient(url);
    try {
      await unencryptedClient.connect();

      const keyVaultClient = this.dbEncryptionManager.getKeyVault(unencryptedClient.db(dbName));
      const dek = await keyVaultClient.findOne(
        { keyAltNames: dbEncryptionConfig?.vault?.dataKeyName },
        { projection: { _id: 1 } }
      );

      return dek?._id;
    } finally {
      await unencryptedClient.close();
    }
  }

  // private buildKeyId = () => new Binary(Buffer.from(configService.getDbEncryptionConfigs.vault.keyId, 'base64'), Binary.SUBTYPE_UUID);

  private getBsonType = (type: any) => {
    if (isArray(type)) return 'array';
    else if (type instanceof Date) return 'date';
    else {
      switch (typeof type) {
        case 'number':
          if (!Number.isInteger(type)) return 'double';
          else return typeof type;

        case 'bigint':
          return 'int';

        case 'boolean':
          return 'bool';

        default:
          return typeof type;
      }
    }
  };

  private buildProperties = (properties: any, encryptionFields: NestedFieldType[]) => {
    encryptionFields?.forEach(encryptionField => {
      const propertyKey = encryptionField.path;

      if (instanceOfT<CSFLEOptionType>(encryptionField, 'bsonType')) {
        // const bsonType = this.getBsonType(encryptionFieldAttr);
        const bsonType = encryptionField.bsonType;
        const algorithm = this.UNSUPPORTED_BSON_TYPE_FOR_RANDOM_ALGORITHM.includes(bsonType)
          ? DbAlgorithm.RANDOM
          : encryptionField.algorithm ?? undefined;

        properties[propertyKey] = { encrypt: { bsonType, algorithm } };
      } else {
        const nestedSchema = { properties: {}, bsonType: 'object' };
        this.buildProperties(nestedSchema.properties, encryptionField.subFields);
        properties[propertyKey] = nestedSchema;
      }
    });
  };

  private parseNestedEncryptionData = (fields: CSFLEOptionType[]) => {
    const result: NestedFieldType[] = [];

    for (const item of fields) {
      const keys = item.path.toString().split('.');
      let currentFields = result;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]!;
        let existingNode = currentFields.find(node => node.path === key);

        if (!existingNode) {
          existingNode = { path: key, subFields: [] };
          currentFields.push(existingNode);
        }

        currentFields = (<any>existingNode).subFields;
      }

      const lastKey = keys[keys.length - 1]!;
      const key = lastKey.endsWith('[]') ? lastKey.slice(0, -2) : lastKey;
      currentFields.push({ ...item, path: key });
    }

    return result;
  };
}
