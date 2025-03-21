import { BaseEntity } from '../entities';
import { withoutEmptyValues } from '../utils';
import { AnyObj, DBQuery, IQuery } from '../types';
import { BaseSchema } from '../../external-lib/mongo-db';

export abstract class BasePersistenceMapper<
  Entity extends BaseEntity,
  Schema extends BaseSchema,
  QueryOptions = IQuery,
> {
  abstract domainToPersistence(domain: Entity): Schema;

  abstract persistenceToDomain(persistence: Schema): Entity;

  updateDomainToPeristence(domain: Partial<Entity>): Partial<Schema> | AnyObj {
    return withoutEmptyValues(domain);
  }

  mapQuery(query: QueryOptions): DBQuery<Schema> {
    return withoutEmptyValues(query as AnyObj);
  }
}
