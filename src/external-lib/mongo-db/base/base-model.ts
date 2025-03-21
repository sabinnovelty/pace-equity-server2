import { MatchType } from '../../../shared/enum';
import { MongoConnection } from '../mongodb-connection';
import { NotFoundException } from '../../../shared/exception';
import { SOFT_DELETION_FIELD } from '../../../shared/constants';
import {
  AnyObj,
  CountResponse,
  FindAllResponse,
  Maybe,
  ServiceOption,
} from '../../../shared/types';
import {
  deleteProperty,
  findDissimilarFields,
  resolveAssigner,
  withOnlyAttrs,
  withoutAttrs,
} from '../../../shared/utils';
import {
  EncryptionFieldType,
  ICreateOptions,
  IDbOption,
  IDeleteOptions,
  IUpdateOptions,
  ModelAttributesType,
  MongoDbQuery,
} from '../types';
import {
  AdminBaseSchema,
  BaseSchema,
  CommonSchema,
  IAccessModel,
  ICommonModel,
  IModel,
  IUpdateResponse,
  ModelOptions,
} from '../interface';
import {
  prepareSearchCondition,
  prepareSoftDeletionCondition,
  resolveBody,
  resolveFindOptions,
  resolvePaginationOptions,
  validateSortBy,
} from '../util';
import {
  FindOptions,
  Document,
  Filter,
  WithId,
  OptionalUnlessRequiredId,
  Collection,
  ObjectId,
  FindOneAndUpdateOptions,
  AggregateOptions,
} from 'mongodb';

/**
 * The ModelHelper class provides methods for constructing query conditions and search queries based on input parameters.
 * */
class QueryHelper<ModelEntity extends CommonSchema> {
  public useSoftDelete = false;
  public searchableFields: ModelAttributesType<ModelEntity> = [];
  public filterableFields: ModelAttributesType<ModelEntity> = [];
  public nonFilterableFields: ModelAttributesType<ModelEntity> = [];
  public encryptedFieldsObj?: EncryptionFieldType<ModelEntity>; //Encryption fields
  public isolateOrganization = false;
  public isolateNetwork = false;

  /**
   * The function "buildQuery" constructs query conditions based on the input query.
   * Additionally, it also attaches the query to perform organization level isolation.
   * @param {any} query - The `query` parameter is an object that contains the conditions for
   * constructing a query.
   * @returns the query conditions.
   */
  protected buildQuery(query: MongoDbQuery<ModelEntity>) {
    const queryConditions = this.constructConditions(query);

    return queryConditions;
  }

  /**
   * The function constructs conditions for a query by filtering out certain attributes and adding
   * additional conditions based on the query parameters.
   * @param {any} query - The `query` parameter is an object that contains various properties used for
   * filtering and searching data.
   * @returns the conditions object.
   */
  private constructConditions(query: MongoDbQuery) {
    let andConditions: any[] = [
      withoutAttrs(query, [
        'keyword',
        'fields',
        'excludeFields',
        'sortBy',
        'limit',
        'offset',
        'paramType',
        'getDeleted',
        'matchType',
      ]),
    ];

    if (this.nonFilterableFields.length)
      andConditions = [withoutAttrs(andConditions[0], this.nonFilterableFields as any)];
    if (this.filterableFields.length)
      andConditions = [this.buildFilterQuery(query, andConditions[0])];
    if (this.useSoftDelete) {
      if (!query.getDeleted && !query[SOFT_DELETION_FIELD]) {
        andConditions.push(prepareSoftDeletionCondition());
      }
    }

    if (query.keyword) andConditions.push(this.buildSearchQuery(query.keyword));
    if (query._id && ObjectId.isValid(query._id)) {
      andConditions.push({ _id: ObjectId.createFromHexString(query._id) as any });
    }
    if (query.rawQuery) andConditions.push(query.rawQuery);

    const conditions = { $and: andConditions };

    return conditions;
  }

  private buildFilterQuery(
    query: MongoDbQuery,
    conditions: Filter<ModelEntity>
  ): Filter<ModelEntity> {
    let filteredConditions: Filter<ModelEntity> = withOnlyAttrs(conditions, this.filterableFields);

    const matchType = query.propertyMatchType ?? MatchType.PARTIAL;

    if (matchType === MatchType.PARTIAL) {
      const regexConditions = Object.keys(filteredConditions).map(field =>
        prepareSearchCondition(field as string, filteredConditions[field])
      );
      if (regexConditions?.length) {
        filteredConditions = { $and: regexConditions } as Filter<ModelEntity>;
      }
    }

    return filteredConditions;
  }

  /**
   * The function builds a search query using a keyword and a list of searchable fields.
   * @param {string} keyword - The `keyword` parameter is a string that represents the search term or
   * keyword that will be used to search for matching records in the searchable fields.
   * @returns a search query object.
   */
  private buildSearchQuery(keyword: string) {
    const encryptedFields = this.encryptedFieldsObj?.fields.map(x => x.path);
    const conditions = this.searchableFields
      ?.filter(
        x =>
          !encryptedFields?.some(
            encryptedField =>
              encryptedField == x || x?.toString().includes(encryptedField?.toString())
          )
      )
      .map(field => {
        if (field) return prepareSearchCondition(field as string, keyword);
      })
      .filter(field => !!field);

    if (!conditions.length) return {};

    return { $or: conditions as Filter<WithId<ModelEntity>>[] };

    // const conditions = this.searchableFields
    //   ?.filter(x => !encryptedFields?.includes(x))
    //   .map(f => ({ $regexMatch: { input: `$${f.toString()}`, regex: keyword?.trim(), options: 'i' } }));
    // if (!conditions.length) return {};

    // return { $expr: { $or: conditions } };
  }

  /**
   * The function checks whether the query is empty or not.
   * @param {any} query - The `query` parameter is an object that contains various properties used for
   * filtering and searching data.
   * @returns true if query is not empty, otherwise false
   */
  protected checkQueryIsEmpty(query: Maybe<AnyObj>) {
    return !query || Object.keys(query).length === 0;
  }
}

class CommonModel<ModelEntity extends CommonSchema>
  extends QueryHelper<ModelEntity>
  implements ICommonModel<ModelEntity>
{
  public model?: Collection<ModelEntity>;
  public watchModel?: Collection<ModelEntity>;

  readonly modelName: string;
  readonly modelKeys: ModelAttributesType<ModelEntity> = [];

  protected isBaseService: boolean;
  public uniqueIdentifierField: keyof ModelEntity | null = null;
  public uniqueFields: ModelAttributesType<ModelEntity> = [];
  public indexingFields: ModelAttributesType<ModelEntity> = [];
  public protectedFields: ModelAttributesType<ModelEntity> = [];

  constructor(
    private mongodbConnection: MongoConnection,
    modelName: string,
    options: ModelOptions<ModelEntity> = {},
    isBaseService: boolean
  ) {
    super();
    this.modelName = modelName;
    Object.entries(options).map(([key, value]) => {
      (this as any)[key] = value;
    });
    this.isBaseService = isBaseService;
  }

  keywordFilterableFields?: ModelAttributesType<ModelEntity> | undefined;
  advancedFilterableFields?: ModelAttributesType<ModelEntity> | undefined;

  /**
   * The `init` function initializes the model by setting the collection and setting up indexes.
   */
  init() {
    this.model = this.mongodbConnection.dbInstance!.collection<ModelEntity>(this.modelName);
    this.watchModel = this.mongodbConnection.watchDbInstance!.collection<ModelEntity>(
      this.modelName
    );
    this.setupIndexes();

    // make uniqueIdentifierField as filterable
    if (this.uniqueIdentifierField && !this.filterableFields.includes(this.uniqueIdentifierField)) {
      this.filterableFields.push(this.uniqueIdentifierField);
    }
  }

  private setupIndexes() {
    for (const key of this.uniqueFields) {
      this.model?.createIndex({ [key]: 1 }, { unique: true, background: true });
    }
    for (const key of this.indexingFields) {
      this.model?.createIndex({ [key]: 1 }, { background: true });
    }

    // create index for uniqueIdentifierField
    if (this.uniqueIdentifierField) {
      this.model?.createIndex(
        { [this.uniqueIdentifierField]: 1 },
        { unique: true, background: true }
      );
    }
  }

  /**
   * The function "validateModel" checks if a model exists and throws a "NotFoundError" if it does not.
   */
  protected validateModel() {
    if (!this.model)
      throw new NotFoundException(`MongoDb model for '${this.modelName}' not initialized!`);
  }

  /**
   * Counts the number of documents in the collection that match the given query criteria.
   * @param query - The `query` parameter is an object that represents the filter criteria for the
   * database query. It can include various properties to specify the conditions for the query.
   * @param options - The `options` parameter is an object that can contain various options for the find
   * operation. It can include options such as sorting, pagination, and additional service options.
   * @returns `CountResponse` containing the total count of matching documents.
   */
  async count(
    query: MongoDbQuery<ModelEntity> = {},
    options: FindOptions<Document> & IDbOption = {}
  ): Promise<CountResponse> {
    this.validateModel();

    const conditions = super.buildQuery(query);
    const count = await this.model!.countDocuments(conditions, options);

    return { count };
  }

  /**
   * The `find` function retrieves documents from a MongoDB collection based on a query and returns the
   * count and rows of the retrieved documents.
   * @param query - The `query` parameter is an object that represents the filter criteria for the
   * database query. It can include various properties to specify the conditions for the query.
   * @param options - The `options` parameter is an object that can contain various options for the find
   * operation. It can include options such as sorting, pagination, and additional service options.
   * @returns The function `find` returns a promise that resolves to an object of type
   * `IFindAllResponse<ModelEntity>`. This object has two properties: `count` and `rows`. `count`
   * represents the total number of documents that match the query conditions, and `rows` is an array of
   * documents that match the query conditions.
   */
  async find(
    query: MongoDbQuery<ModelEntity> = {},
    options: FindOptions<Document> & IDbOption = {}
  ): Promise<FindAllResponse<ModelEntity>> {
    this.validateModel();

    const conditions = super.buildQuery(query);

    const { skip, limit, order } = resolvePaginationOptions(query);
    const findOptions = {
      ...resolveFindOptions(query, options),
      ...(withoutAttrs(options, ['authEntity']) as object),
    };

    const rows = await this.model!.find(conditions, findOptions)
      .skip(skip)
      .limit(limit)
      .sort(order)
      .allowDiskUse()
      .toArray();

    return rows as ModelEntity[];
  }

  /**
   * The `find` function retrieves documents from a MongoDB collection based on a query and returns
   * all of the retrieved documents.
   * @param query - The `query` parameter is an object that represents the filter criteria for the
   * database query. It can include various properties to specify the conditions for the query.
   * @param options - The `options` parameter is an object that can contain various options for the find
   * operation. It can include options such as sorting, and additional service options.
   * @returns The function `findAll` returns a promise that resolves to an object of type
   * `<ModelEntity[]>`.
   */
  async findAll(
    query: MongoDbQuery<ModelEntity> = {},
    options: FindOptions<Document> & IDbOption = {}
  ): Promise<ModelEntity[]> {
    this.validateModel();

    const conditions = super.buildQuery(query);

    const findOptions = {
      ...resolveFindOptions(query, options),
      ...(withoutAttrs(options, ['authEntity']) as object),
    };
    const order = validateSortBy(query.sortBy);

    const rows = await this.model!.find(conditions, findOptions)
      .sort(order)
      .allowDiskUse()
      .toArray();

    return rows as ModelEntity[];
  }

  /**
   * The `findOne` function retrieves a single document from the database based on the provided query and
   * options.
   * @param query - The `query` parameter is an object that represents the conditions to be used for
   * finding a document in the database. It can include various properties that define the search
   * criteria, such as field values, comparison operators, and logical operators.
   * @param [options] - The `options` parameter is an optional object that can be used to specify
   * additional options for the `findOne` operation. It can include properties such as `projection`,
   * `sort`, `skip`, `limit`, etc. These options can be used to customize the behavior of the `findOne`
   * operation and
   * @returns The method `findOne` returns a promise that resolves to either a `WithId<ModelEntity>`
   * object or `null`.
   */
  async findOne(
    query: MongoDbQuery<ModelEntity> = {},
    options?: FindOptions<Document> & IDbOption
  ): Promise<WithId<ModelEntity> | null> {
    this.validateModel();
    const conditions = super.buildQuery({ ...query, propertyMatchType: MatchType.WHOLE });

    return this.model!.findOne(conditions, options) ?? null;
  }

  /**
   * The `create` function inserts a new document into the database and returns either the inserted
   * document or its ID.
   * @param {ModelEntity} body - The `body` parameter is an object that represents the data to be
   * inserted into the database. It should be an instance of the `ModelEntity` class.
   * @param [options] - The `options` parameter is an optional object that can contain additional options
   * for the `create` method. It is a combination of `FindOptions<Document>` and `ICreateOptions` types.
   * @returns a Promise that resolves to either a ModelEntity object or a string.
   */
  async create(
    body: ModelEntity,
    options?: FindOptions<Document> & ICreateOptions
  ): Promise<ModelEntity | string | null> {
    this.validateModel();
    body = resolveBody(body, this.isBaseService, options);
    const resource = await this.model!.insertOne(
      body as OptionalUnlessRequiredId<ModelEntity>,
      options
    );

    const id = resource?.insertedId?.toString();
    if (!id) return null;

    return options?.returnModel ? <ModelEntity>{ _id: id, ...body } : id;
  }

  /**
   * The `createMany` function inserts multiple entities into the database and returns either the
   * inserted entities or their IDs.
   * @param {ModelEntity[]} bodyList - An array of ModelEntity objects that will be created.
   * @param [options] - ICreateOptions<ModelEntity> - An optional object that contains additional options
   * for the create operation.
   * @returns The function `createMany` returns a promise that resolves to either an array of
   * `ModelEntity` objects or an array of strings.
   */
  async createMany(
    bodyList: ModelEntity[] = [],
    options?: ICreateOptions<ModelEntity>
  ): Promise<ModelEntity[] | string[] | any[]> {
    this.validateModel();
    bodyList = bodyList.map(body => <ModelEntity>resolveBody(body, this.isBaseService, options));
    const resource = await this.model!.insertMany(
      bodyList as OptionalUnlessRequiredId<ModelEntity>[],
      options
    );
    const insertedIds = resource.insertedIds;

    if (options?.returnModel) {
      for (let i = 0; i < bodyList.length; i++) {
        bodyList[i]!._id = insertedIds[i]?.toString();
      }

      return bodyList;
    }

    return Object.values(insertedIds)?.map(x => x);
  }

  /**
   * The function aggregates data using a specified pipeline and returns the result as an array.
   * @param {any} pipeline - The pipeline parameter is an array of stages that define the sequence of
   * operations to be performed on the data. Each stage in the pipeline represents a specific operation,
   * such as filtering, sorting, or grouping, that will be applied to the data.
   * @param {AggregateOptions} [options] - The `options` parameter is an optional object that can be used
   * to specify additional options for the aggregation operation. Some common options include:
   * @returns The `aggregate` method is returning the result of the aggregation operation as an array.
   */
  async aggregate(pipeline: any, options?: AggregateOptions) {
    this.validateModel();

    return await this.model!.aggregate(pipeline, options).toArray();
  }

  async aggregateUsingWatchModel(pipeline: any, options?: AggregateOptions) {
    this.validateModel();
    //Remove session
    deleteProperty(options, ['session'] as unknown as any);

    return await this.watchModel!.aggregate(pipeline, options).toArray();
  }
}

export class AccessModel<ModelEntity extends AdminBaseSchema>
  extends CommonModel<ModelEntity>
  implements IAccessModel<ModelEntity>
{
  constructor(
    mongodbConnection: MongoConnection,
    modelName: string,
    options: ModelOptions<ModelEntity> = {}
  ) {
    super(mongodbConnection, modelName, options, false);
  }
}

export class BaseModel<ModelEntity extends BaseSchema>
  extends CommonModel<ModelEntity>
  implements IModel<ModelEntity>
{
  constructor(
    mongodbConnection: MongoConnection,
    modelName: string,
    options: ModelOptions<ModelEntity> = {}
  ) {
    super(mongodbConnection, modelName, options, true);
  }

  async updateOne(
    query: MongoDbQuery<ModelEntity>,
    body: Partial<ModelEntity> | AnyObj,
    options: FindOneAndUpdateOptions & IUpdateOptions = {}
  ): Promise<WithId<ModelEntity> | IUpdateResponse<ModelEntity> | null> {
    super.validateModel();

    const conditions = super.buildQuery({ ...query, propertyMatchType: MatchType.WHOLE });

    const resolvedBody = {
      ...withoutAttrs(body, ['updated']),
      ...this._resolveUpdatedAssigner(options),
    };

    const data = await this.model!.findOneAndUpdate(
      conditions,
      { $set: resolvedBody as any },
      withoutAttrs(options, ['includeResultMetadata']) // Only for type checking. If this is not removed, the type of data will be ModifyResult<ModelEntity> instead of WithId<ModelEntity>
    );

    if (!data) return null;

    const updated = {
      ...(await this.findOne({ _id: data._id?.toString() as any }, options))!,
      ...resolvedBody,
    };
    if (!options.includeChangedData) {
      return updated;
    }

    const dissimilarFields = findDissimilarFields(data, resolvedBody, [
      'updated',
      SOFT_DELETION_FIELD,
    ]);
    const changed: any = {};
    dissimilarFields?.forEach(field => {
      changed[field] = { new: updated[field], old: (<any>data)[field] };
    });

    return { updated, changed };
  }

  async updateMany(
    query: MongoDbQuery<ModelEntity>,
    body: Partial<ModelEntity> | AnyObj,
    options: FindOneAndUpdateOptions & IUpdateOptions = {}
  ): Promise<number> {
    super.validateModel();

    const allowAllUpdates = options.allowAllUpdates ?? false;
    const conditions = super.buildQuery({ ...query, propertyMatchType: MatchType.WHOLE });
    const queryForUpdate = conditions.$and[0];

    // Guard to avoid updating all the documents if the query is empty. Use `allowAllUpdates` to override this guard.
    if (
      !allowAllUpdates &&
      this.checkQueryIsEmpty(queryForUpdate) &&
      this.checkQueryIsEmpty(query.rawQuery)
    ) {
      return 0;
    }

    const resolvedBody = {
      ...withoutAttrs(body, ['updated']),
      ...this._resolveUpdatedAssigner(options),
    };

    const result = await this.model!.updateMany(conditions, { $set: resolvedBody as any }, options);

    return result.modifiedCount;
  }

  async deleteMany(query: MongoDbQuery<ModelEntity>, options?: IDeleteOptions): Promise<number> {
    super.validateModel();
    const conditions = super.buildQuery({ ...query, propertyMatchType: MatchType.WHOLE });

    const allowAllDeletions = options?.allowAllDeletions ?? false;

    const queryForUpdate = conditions.$and[0];

    // Guard to avoid deleting all the documents if the query is empty. Use `allowAllUpdates` to override this guard.
    if (
      !allowAllDeletions &&
      this.checkQueryIsEmpty(queryForUpdate) &&
      this.checkQueryIsEmpty(query.rawQuery)
    ) {
      return 0;
    }

    if (this.useSoftDelete) {
      const body: AnyObj = { [SOFT_DELETION_FIELD]: resolveAssigner(options) };
      if (options?.sourceModule) {
        body[SOFT_DELETION_FIELD].trigger = options?.sourceModule;
      }
      const deletedData = await this.model!.updateMany(conditions, { $set: body } as any, {
        session: options?.session,
      });

      return deletedData.modifiedCount;
    }

    const deletedData = await this.model!.deleteMany(conditions, options);

    return deletedData.deletedCount;
  }

  async deleteOne(query: MongoDbQuery<ModelEntity> = {}, options?: IDbOption) {
    super.validateModel();

    const conditions = super.buildQuery({ ...query, propertyMatchType: MatchType.WHOLE });

    if (this.useSoftDelete) {
      const body: AnyObj = {
        [SOFT_DELETION_FIELD]: resolveAssigner(options),
      };

      if (options?.sourceModule) {
        body[SOFT_DELETION_FIELD].trigger = options.sourceModule;
      }

      const deletedData = await this.model!.updateOne(conditions, { $set: body } as any, {
        session: options?.session,
      });

      return { isDeleted: !!deletedData };
    }

    await this.model!.deleteOne(conditions, options);

    return { isDeleted: true };
  }

  private _resolveUpdatedAssigner(options: ServiceOption) {
    const updatedAssigner = resolveAssigner(options);

    return {
      'updated.at': updatedAssigner.at,
      'updated.by': updatedAssigner.by,
      'updated.id': updatedAssigner.id,
      'updated.tokenId': updatedAssigner.tokenId,
      ...(updatedAssigner.clientAssigner && {
        'updated.clientAssigner': updatedAssigner.clientAssigner,
      }),
    };
  }
}
