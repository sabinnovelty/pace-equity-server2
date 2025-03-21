import { WithId } from 'mongodb';
import { GetDTOKeys } from '../../../shared/types';

/**
 * The type `IChangedData` represents a record where each property key is a key from the input type
 * `T`, and each property value is an object with `old` and `new` properties representing the old and
 * new values of that key.
 * @property It represents an object that contains the changed data for each property in `T`.
 */
export type IChangedData<T extends Record<string, any> = any> = {
  [P in GetDTOKeys<T>]: { old: any; new: any };
};

/**
 * The `IUpdateResponse` interface is defining the structure of the response object returned
 * when performing an update operation on a model entity.
 * */
export interface IUpdateResponse<ModelEntity extends Record<string, any>> {
  updated: WithId<ModelEntity>;
  changed: IChangedData<ModelEntity>;
}

export * from './field-option';
export * from './schema';
export * from './model';
