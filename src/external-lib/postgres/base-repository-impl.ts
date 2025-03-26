import { BaseSchema } from './schema';
import { Repository } from 'typeorm';
import { BaseEntity } from '../../shared/entities';
// import { errorMessage } from '../../shared/constants';
// import { DomainException } from '../../shared/exception';
// import { formatModuleMessage } from '../../shared/utils';
import { BasePersistenceMapper, BaseRepository } from '../../shared/abstractions';
import {
  CountResponse,
  FindAllResponse,
  IQuery,
  Nullable,
  ServiceOption,
} from '../../shared/types';

export class BaseRepositoryImpl<
  Entity extends BaseEntity,
  Schema extends BaseSchema,
  QueryOptions = IQuery,
> implements BaseRepository<Entity, QueryOptions>
{
  constructor(
    protected model: Repository<Schema>,
    protected mapper: BasePersistenceMapper<Entity, Schema, QueryOptions>
  ) {}
  count(query: QueryOptions, option?: ServiceOption): Promise<CountResponse> {
    throw new Error('Method not implemented.');
  }
  findOneById(id: Entity['id'], option?: ServiceOption): Promise<Nullable<Entity>> {
    throw new Error('Method not implemented.');
  }
  updateById(
    id: Entity['id'],
    body: Partial<Entity>,
    option?: ServiceOption
  ): Promise<Nullable<Entity>> {
    throw new Error('Method not implemented.');
  }
  update(entity: Entity, option?: ServiceOption): Promise<Nullable<Entity>> {
    throw new Error('Method not implemented.');
  }
  updateMany(query: QueryOptions, body: Partial<Entity>, option?: ServiceOption): Promise<number> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: Entity['id'], option?: ServiceOption): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteMany(id: Entity['id'], option?: ServiceOption): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(entity: Entity, option?: ServiceOption): Promise<Entity> {
    {
      const createdEntity = await this.model.create(this.mapper.domainToPersistence(entity));

      return this.mapper.persistenceToDomain(createdEntity);
    }
  }

  async findAll(query: QueryOptions, option?: ServiceOption): Promise<FindAllResponse<Entity>> {
    const rows = await this.model.find(this.mapper.mapQuery(query));

    return rows.map(r => this.mapper.persistenceToDomain(r));
  }

  //   async findOneById(id: Entity['id'], option?: ServiceOption): Promise<Nullable<Entity>> {
  //     const entity = await this.model.findOneBy({
  //       id// Equal is used for direct value matching
  //     });
  //     if (entity) return this.mapper.persistenceToDomain(entity as Schema);

  //     return null;
  //   }

  //   async updateById(
  //     id: Entity['id'],
  //     body: Partial<Entity>,
  //     option?: ServiceOption
  //   ): Promise<Nullable<Entity>> {
  //     const updateResponse = await this.model.updateOne(
  //       { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
  //       this.mapper.updateDomainToPeristence(body),
  //       option
  //     );
  //     if (!updateResponse) return null;

  //     return this.mapper.persistenceToDomain(updateResponse as Schema);
  //   }

  //   async update(entity: Entity, option?: ServiceOption): Promise<Nullable<Entity>> {
  //     {
  //       const updateResponse = await this.model.updateOne(
  //         { [this.model.uniqueIdentifierField as string]: entity.id } as DBQuery<Schema>,
  //         this.mapper.domainToPersistence(entity),
  //         option
  //       );
  //       if (updateResponse) return this.mapper.persistenceToDomain(updateResponse as Schema);

  //       return null;
  //     }
  //   }

  //   async updateMany(
  //     query: QueryOptions,
  //     body: Partial<Entity>,
  //     option?: ServiceOption
  //   ): Promise<number> {
  //     const updateResponse = await this.model.updateMany(
  //       query as DBQuery<Schema>,
  //       this.mapper.updateDomainToPeristence(body),
  //       option
  //     );

  //     return updateResponse;
  //   }

  //   async deleteMany(id: Entity['id'], option?: ServiceOption): Promise<void> {
  //     await this.model.deleteMany(
  //       { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
  //       option
  //     );
  //   }

  //   async deleteById(id: Entity['id'], option?: ServiceOption): Promise<void> {
  //     await this.model.deleteOne(
  //       { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
  //       option
  //     );
  //   }
}
