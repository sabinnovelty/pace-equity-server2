import { CommonSchema } from '../interface';
import DbAlgorithm from '../encryptions/db-algorithm';
import { BSONTypeAlias, Binary, Filter } from 'mongodb';
import { DBQuery, GetDTOKeys, ServiceOption } from '../../../shared/types';

export type ModelObj<T extends Record<string, any> = any, V = any> = {
  [P in GetDTOKeys<T>]?: V;
};

export type DbMatchStage<T extends Record<string, any> = any> = ModelObj<T>;

export type ModelAttributesType<EntityType extends CommonSchema> = Array<
  keyof EntityType | GetDTOKeys<EntityType>
>;

/**
 * 1. CSFLE : Client Side Field Level Encryption
 * 2. QE : Queryable Encryption
 *
 */
export type InUseEncryptionType = 'CSFLE' | 'QE';

export type EncryptionOptionType<EntityType extends CommonSchema = any> = {
  path: keyof EntityType | GetDTOKeys<EntityType>;
  bsonType: BSONTypeAlias;
  /**
   * Optional. Use only if you want to use explicit encryption, which requires you to generate a key for each field in advance.
   */
  keyId?: Binary;
};

export type CSFLEOptionType<EntityType extends CommonSchema = any> =
  EncryptionOptionType<EntityType> & {
    algorithm?: DbAlgorithm;
  };

export type QEOptionType<EntityType extends CommonSchema = any> =
  EncryptionOptionType<EntityType> & {
    queries?: {
      /**
       * Querying non-encrypted fields or encrypted fields with a supported query type returns encrypted data that is then decrypted at the client.
       * | Supported Query Types | Unsupported BSON types|
       * |-----------------------|-----------------------|
       * | $eq                   | double                |
       * | $ne                   | decimal128            |
       * | $in                   | object                |
       * | $nin                  | array                 |
       * | $and                  |                       |
       * | $or                   |                       |
       * | $not                  |                       |
       * | $nor                  |                       |
       * | $expr                 |                       |
       * |-----------------------|-----------------------|
       *
       * Defaults to 'none'
       * If the query type is none, the field is encrypted, but clients can't query it.
       *
       * Note: Queries that compare an encrypted field to null or to a regular expression result in an error, even with supported query operators.
       */
      queryType: 'equality' | 'none';
      /**
       * The 'contention' property is used to prefer either find performance, or write and update performance.
       *
       * Inserting the same field/value pair into multiple documents in close succession can cause conflicts that delay insert operations.
       *
       * MongoDB tracks the occurrences of each field/value pair in an encrypted collection using an internal counter.
       * The contention factor partitions this counter, similar to an array.
       * This minimizes issues with incrementing the counter when using insert, update, or findAndModify to add or modify an encrypted field
       * with the same field/value pair in close succession. contention = 0 creates an array with one element at index 0.
       * contention = 4 creates an array with 5 elements at indexes 0-4. MongoDB increments a random array element during insert.
       * If unset, contention defaults to 8.
       *
       * High contention improves the performance of insert and update operations on low cardinality fields, but decreases find performance.
       *
       * Consider increasing contention above the default value of 8 only if:
       * 1. The field has low cardinality or low selectivity. A state field may have 50 values, but if 99% of the data points use {state: NY}, that pair is likely to cause contention.
       * 2. Write and update operations frequently modify the field. Since high contention values sacrifice find performance in favor of write and update operations, the benefit of a high contention factor for a rarely updated field is unlikely to outweigh the drawback.
       *
       * Consider decreasing contention if:
       * 1. The field is high cardinality and contains entirely unique values, such as a credit card number.
       * 2. The field is often queried, but never or rarely updated. In this case, find performance is preferable to write and update performance.
       */
      contention?: string;
    };
  };

/**
 * @inUseEncryptionType supports CSFLE or QE
 * @fields options to determine the encrypted fields
 */
export type EncryptionFieldType<EntityType extends CommonSchema = any> = {
  inUseEncryptionType: InUseEncryptionType;
  fields: CSFLEOptionType<EntityType>[] | QEOptionType<EntityType>[];
};

export type IDbOption = ServiceOption & {
  useWatchModel?: boolean; //default: false | A boolean flag indicating whether to use an plain model. The default value is false.
};

export type ICreateOptions<T extends CommonSchema = any> = {
  returnModel?: boolean; //to return the created body with _id
  logFields?: GetDTOKeys<T>[];
} & IDbOption;

export type IUpdateOptions = {
  includeChangedData?: boolean;
  allowAllUpdates?: boolean;
} & IDbOption;

export type IDeleteOptions = {
  allowAllDeletions?: boolean;
} & IDbOption;

export type IMongoDbLocation = {
  type: 'Point';
  /**
   * [longitude, latitude]
   */
  coordinates: [number, number];
};

export type MongoDbQuery<Schema = any> = DBQuery<Schema> & { rawQuery?: Filter<Schema> };
