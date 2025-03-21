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
  abstract count(query: QueryOptions, option?: ServiceOption): Promise<CountResponse>;
  abstract get(query: QueryOptions, option?: ServiceOption): Promise<FindAllResponse<Entity>>;
  abstract getOneById(id: Entity['id'], option?: ServiceOption): Promise<Entity>;
  abstract updateById(
    id: Entity['id'],
    updateDto: UpdateDto,
    option?: ServiceOption
  ): Promise<Entity>;
  abstract deleteById(id: Entity['id'], option?: ServiceOption): Promise<void>;
}
