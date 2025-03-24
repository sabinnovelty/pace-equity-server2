import { CountResponse } from '../types';
import { ServiceOption } from '../types/service';
import { BaseEntity } from '../entities/base-entity';
import { IQuery, FindAllResponse } from '../types/query';

export abstract class BaseService<
  Entity extends BaseEntity,
  CreateDto,
  UpdateDto,
  QueryOptions = IQuery,
> {
  abstract create(createDto: CreateDto, option?: ServiceOption): Promise<Entity>;
  abstract get(query: QueryOptions, option?: ServiceOption): Promise<FindAllResponse<Entity>>;
  // abstract getOneById?(id: number, option?: ServiceOption): Promise<Entity>;
  abstract updateById(id: number, updateDto: UpdateDto, option?: ServiceOption): Promise<Entity>;
  abstract deleteById(id: number, option?: ServiceOption): Promise<void>;
  abstract count(query: QueryOptions, option?: ServiceOption): Promise<CountResponse>;
}
