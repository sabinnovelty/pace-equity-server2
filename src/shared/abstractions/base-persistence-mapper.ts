import { BaseEntity } from '../entities';
import { FindManyOptions } from 'typeorm';
import { withoutEmptyValues } from '../utils';
import { AnyObj, IQuery } from '../types';
import { BaseSchema } from '../../external-lib/postgres/schema';

export abstract class BasePersistenceMapper<
  Entity extends BaseEntity,
  Schema extends BaseSchema,
  QueryOptions = IQuery,
> {
  abstract domainToPersistence(domain: Entity): Schema;

  abstract persistenceToDomain(persistence: Schema): Entity;

  updateDomainToPersistence(domain: Partial<Entity>): Partial<Schema> | AnyObj {
    return withoutEmptyValues(domain);
  }

  mapQuery(query: QueryOptions): FindManyOptions<Schema> {
    return withoutEmptyValues(query as AnyObj);
  }
}
