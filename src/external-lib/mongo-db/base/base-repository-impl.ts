import { BaseSchema, IModel } from '../interface';
import { BaseEntity } from '../../../shared/entities';
import { errorMessage } from '../../../shared/constants';
import { DomainException } from '../../../shared/exception';
import { formatModuleMessage } from '../../../shared/utils';
import { BasePersistenceMapper, BaseRepository } from '../../../shared/abstractions';
import {
  CountResponse,
  DBQuery,
  FindAllResponse,
  IQuery,
  Nullable,
  ServiceOption,
} from '../../../shared/types';

export class BaseRepositoryImpl<
  Entity extends BaseEntity,
  Schema extends BaseSchema,
  QueryOptions = IQuery,
> implements BaseRepository<Entity, QueryOptions>
{
  constructor(
    protected model: IModel<Schema>,
    protected mapper: BasePersistenceMapper<Entity, Schema, QueryOptions>
  ) {}

  async create(entity: Entity, option?: ServiceOption): Promise<Entity> {
    {
      const createdEntity = await this.model.create(this.mapper.domainToPersistence(entity), {
        ...option,
        returnModel: true,
      });
      if (!createdEntity)
        throw new DomainException(
          errorMessage.DEFAULT_ERROR,
          formatModuleMessage(
            errorMessage.MODULE_CREATION_FAILED,
            `document for collection: ${this.model.modelName}`
          )
        );

      return this.mapper.persistenceToDomain(createdEntity as Schema);
    }
  }

  async count(query: QueryOptions, option?: ServiceOption): Promise<CountResponse> {
    const countResponse = await this.model.count(this.mapper.mapQuery(query), option);

    return countResponse;
  }

  async findAll(query: QueryOptions, option?: ServiceOption): Promise<FindAllResponse<Entity>> {
    const rows = await this.model.find(this.mapper.mapQuery(query), option);

    return rows.map(r => this.mapper.persistenceToDomain(r));
  }

  async findOneById(id: Entity['id'], option?: ServiceOption): Promise<Nullable<Entity>> {
    const entity = await this.model.findOne(
      { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
      option
    );
    if (entity) return this.mapper.persistenceToDomain(entity as Schema);

    return null;
  }

  async updateById(
    id: Entity['id'],
    body: Partial<Entity>,
    option?: ServiceOption
  ): Promise<Nullable<Entity>> {
    const updateResponse = await this.model.updateOne(
      { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
      this.mapper.updateDomainToPeristence(body),
      option
    );
    if (!updateResponse) return null;

    return this.mapper.persistenceToDomain(updateResponse as Schema);
  }

  async update(entity: Entity, option?: ServiceOption): Promise<Nullable<Entity>> {
    {
      const updateResponse = await this.model.updateOne(
        { [this.model.uniqueIdentifierField as string]: entity.id } as DBQuery<Schema>,
        this.mapper.domainToPersistence(entity),
        option
      );
      if (updateResponse) return this.mapper.persistenceToDomain(updateResponse as Schema);

      return null;
    }
  }

  async updateMany(
    query: QueryOptions,
    body: Partial<Entity>,
    option?: ServiceOption
  ): Promise<number> {
    const updateResponse = await this.model.updateMany(
      query as DBQuery<Schema>,
      this.mapper.updateDomainToPeristence(body),
      option
    );

    return updateResponse;
  }

  async deleteMany(id: Entity['id'], option?: ServiceOption): Promise<void> {
    await this.model.deleteMany(
      { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
      option
    );
  }

  async deleteById(id: Entity['id'], option?: ServiceOption): Promise<void> {
    await this.model.deleteOne(
      { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
      option
    );
  }
}
