import { IUpdateResponse } from '.';
import { ModelOptions } from './field-option';
import { AdminBaseSchema, BaseSchema, CommonSchema } from './schema';
import { AnyObj, CallbackFuncType, CountResponse, FindAllResponse } from '../../../shared/types';
import {
  ICreateOptions,
  IDbOption,
  IUpdateOptions,
  ModelAttributesType,
  MongoDbQuery,
} from '../types';
import {
  AggregateOptions,
  BulkWriteOptions,
  Collection,
  FindOneAndUpdateOptions,
  FindOptions,
  WithId,
} from 'mongodb';

export type ICommonModel<EntityType extends CommonSchema> = {
  count(
    query?: MongoDbQuery<EntityType>,
    options?: FindOptions<Document> & IDbOption
  ): Promise<CountResponse>;
  find(
    query?: MongoDbQuery<EntityType>,
    options?: FindOptions<Document> & IDbOption
  ): Promise<FindAllResponse<EntityType>>;
  findOne(
    query?: MongoDbQuery<EntityType>,
    options?: FindOptions<Document> & IDbOption
  ): Promise<WithId<EntityType> | null>;
  findAll(
    query?: MongoDbQuery<EntityType>,
    options?: FindOptions<Document> & IDbOption
  ): Promise<EntityType[]>;
  create(
    body: EntityType,
    options?: FindOptions<Document> & IDbOption & ICreateOptions
  ): Promise<EntityType | string | null>;
  createMany(
    body: EntityType[],
    options?: BulkWriteOptions & IDbOption & ICreateOptions
  ): Promise<EntityType[] | string[]>;
  aggregate(pipeline: any, options?: AggregateOptions): Promise<Array<any>>;
  aggregateUsingWatchModel(pipeline: any, options?: AggregateOptions): Promise<Array<any>>;
} & ModelOptions<EntityType> & {
    readonly modelName: string;
    readonly modelKeys: ModelAttributesType<EntityType>;
    model?: Collection<EntityType>;
    readonly init: CallbackFuncType;
  };

export type IAccessModel<EntityType extends AdminBaseSchema> = ICommonModel<EntityType>;

export type IModel<EntityType extends BaseSchema> = ICommonModel<EntityType> & {
  updateOne(
    query: MongoDbQuery<EntityType>,
    body: Partial<EntityType> | AnyObj,
    options?: FindOneAndUpdateOptions & IUpdateOptions
  ): Promise<WithId<EntityType> | IUpdateResponse<EntityType> | null>;
  updateMany(
    query: MongoDbQuery<EntityType>,
    body: Partial<EntityType> | AnyObj,
    options?: FindOneAndUpdateOptions & IUpdateOptions
  ): Promise<number>;
  deleteOne(query: MongoDbQuery<EntityType>, options?: IDbOption): Promise<{ isDeleted: boolean }>;
  deleteMany(query: MongoDbQuery<EntityType>, options?: IDbOption): Promise<number>;
};
