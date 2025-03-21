import { CommonSchema } from './schema';
import { EncryptionFieldType, ModelAttributesType } from '../types';

export interface ISearchOptions<EntityType extends CommonSchema> {
  searchableFields?: ModelAttributesType<EntityType>; //Keyword search
  filterableFields?: ModelAttributesType<EntityType>; //Advanced search
  nonFilterableFields?: ModelAttributesType<EntityType>; //fields to skip while searching
}

export interface IAggregateSearchOptions<EntityType extends CommonSchema> {
  keywordFilterableFields?: ModelAttributesType<EntityType>; //Keyword search
  advancedFilterableFields?: ModelAttributesType<EntityType>; //Advanced search
}

export interface IEncryptionOptions<EntityType extends CommonSchema> {
  encryptedFieldsObj?: EncryptionFieldType<EntityType>; //Encryption fields
}

export interface ModelOptions<EntityType extends CommonSchema>
  extends ISearchOptions<EntityType>,
    IAggregateSearchOptions<EntityType>,
    IEncryptionOptions<EntityType> {
  isolateOrganization?: boolean; //Determines whether organization filter is to be applied
  isolateNetwork?: boolean; //Determines whether network filter is to be applied
  useSoftDelete?: boolean; //Denotes if the collection uses soft deletion or not
  uniqueIdentifierField?: keyof EntityType | null; //_id
  uniqueFields?: ModelAttributesType<EntityType>; //Creates unique indexes
  indexingFields?: ModelAttributesType<EntityType>; //Fields for creating simple indexes
  protectedFields?: ModelAttributesType<EntityType>; //Protected fields whose data once set would never be modified again
}
