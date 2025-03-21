import { CountResponse } from '../types';
import { Nullable } from '../types/object';
import { ServiceOption } from '../types/service';
import { BaseEntity } from '../entities/base-entity';
import { FindAllResponse, IQuery } from '../types/query';

export abstract class BaseRepository<Entity extends BaseEntity, QueryOptions = IQuery> {
  abstract create(entity: Entity, option?: ServiceOption): Promise<Entity>;
  abstract count(query: QueryOptions, option?: ServiceOption): Promise<CountResponse>;
  abstract findAll(query: QueryOptions, option?: ServiceOption): Promise<FindAllResponse<Entity>>;
  abstract findOneById(id: Entity['id'], option?: ServiceOption): Promise<Nullable<Entity>>;
  abstract updateById(
    id: Entity['id'],
    body: Partial<Entity>,
    option?: ServiceOption
  ): Promise<Nullable<Entity>>;
  abstract update(entity: Entity, option?: ServiceOption): Promise<Nullable<Entity>>;
  abstract updateMany(
    query: QueryOptions,
    body: Partial<Entity>,
    option?: ServiceOption
  ): Promise<number>;
  abstract deleteById(id: Entity['id'], option?: ServiceOption): Promise<void>;
  abstract deleteMany(id: Entity['id'], option?: ServiceOption): Promise<void>;
}
