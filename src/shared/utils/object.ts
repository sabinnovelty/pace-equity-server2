import { AnyObj, ChangedData } from '../types/object';
import { isArray as isArrayLodash, isEmpty as isEmptyLodash, isEqual } from 'lodash';

/**
 * Returns a new object containing only the specified attributes from the original object.
 * @param obj The original object.
 * @param attrs The attributes to include in the new object.
 * @returns The new object with only the specified attributes.
 */
export function withOnlyAttrs<T>(obj: any, attrs: any[]): T {
  if (!obj) return obj;
  const result: any = {};

  Object.keys(obj).forEach(key => {
    if (attrs.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

type Without<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

/**
 * Returns a new object excluding the specified attributes from the original object.
 * @param obj The original object.
 * @param attrsToExclude The attributes to exclude from the new object.
 * @returns The new object without the specified attributes.
 */
export function withoutAttrs<T, K extends keyof T>(obj: T, attrsToExclude: K[]): Without<T, K> {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    // It is recommended to use listWithoutAttrs() function instead for arrays.
    throw new TypeError('withoutAttrs() expects first argument to be a plain object, array given.');
  }

  const result: any = {};

  Object.keys(obj).forEach((key: string) => {
    if (!attrsToExclude.includes(key as K)) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * Returns a list of objects with specified attributes excluded from each object in the list.
 * @param obj The list of objects.
 * @param attrsToExclude The attributes to exclude from each object.
 * @returns The list of objects with the specified attributes excluded.
 */
export function listWithoutAttrs<T, K extends keyof T>(
  obj: object[],
  attrsToExclude: any[]
): Without<T, K>[] {
  return obj.map(item => withoutAttrs<T, K>(item as T, attrsToExclude));
}

/**
 * Checks if a string is a valid JSON string.
 * @param str The string to check.
 * @returns `true` if the string is valid JSON, `false` otherwise.
 */
export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

/**
 * Flattens a nested object into a single-level object with dot-separated keys.
 * @param obj The object to flatten.
 * @param prefix The prefix for the keys.
 * @returns The flattened object.
 */
export function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  const flatObj: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        const nestedObj = flattenObject(obj[key], prefixedKey);
        Object.assign(flatObj, nestedObj);
      } else {
        flatObj[prefixedKey] = obj[key];
      }
    }
  }

  return flatObj;
}

/**
 * Returns a new object excluding keys with null, empty string, or undefined values.
 * @param obj The original object.
 * @returns The new object with non-empty values.
 */
export function withoutEmptyValues<T>(obj: AnyObj): T {
  const result: AnyObj = {};
  for (const key in obj) {
    if (!(obj[key] === null || obj[key] === '' || obj[key] === undefined)) {
      result[key] = obj[key];
    }
  }

  return result as T;
}

/**
 * Returns a new object excluding keys with  undefined values.
 * @param obj The original object.
 * @returns The new object with defined values only.
 */
export function withoutUndefinedValues<T>(obj: AnyObj): T {
  const result: AnyObj = {};
  for (const key in obj) {
    if (!(obj[key] === undefined)) {
      result[key] = obj[key];
    }
  }

  return result as T;
}

/**
 * Checks if a value is defined.
 * @param value The value to check.
 * @returns `true` if the value is defined, `false` otherwise.
 */
export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * Checks if a value is empty.
 * @param value The value to check.
 * @returns `true` if the value is empty, `false` otherwise.
 */
export function isEmpty(value: any) {
  return isEmptyLodash(value);
}

/**
 * Deletes specified properties from an object.
 * @param object The object to modify.
 * @param attributes The properties to delete.
 * @returns The modified object with specified properties deleted.
 */
export function deleteProperty<T, Key extends keyof T>(object: T, attributes: Key[]) {
  for (const key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      attributes.includes(key as unknown as Key)
    ) {
      delete object[key];
    }
  }

  return object;
}

/**
 * Checks if an object is an instance of type `T` by verifying the presence of a specified attribute.
 * @param object The object to check.
 * @param attribute The attribute to check for.
 * @returns `true` if the object is an instance of `T`, `false` otherwise.
 */
export function instanceOfT<T>(object: any, attribute: keyof T): object is T {
  if (!object) return false;

  return attribute in object;
}

/**
 * Checks if a value is an array using lodash's `isArray` function.
 * @param value The value to check.
 * @returns `true` if the value is an array, `false` otherwise.
 */
export function isArray<T = any>(value: any): value is Array<T> {
  return isArrayLodash(value);
}

/**
 * Finds fields with different values between two objects, ignoring specified fields.
 * @param obj1 The first object to compare.
 * @param obj2 The second object to compare.
 * @param ignoreFields Fields to ignore during comparison.
 * @returns The list of fields with different values.
 */
export function findDissimilarFields(
  obj1: AnyObj,
  obj2: AnyObj,
  ignoreFields: string[] = []
): string[] {
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  const dissimilarFields: string[] = [];

  allKeys.forEach(key => {
    if (ignoreFields.includes(key)) return;
    if (!isEqual(obj1[key], obj2[key])) dissimilarFields.push(key);
  });

  return dissimilarFields;
}

/**
 * Builds an object representing changed data between two versions of an object, ignoring specified fields.
 * @param oldData The old version of the data.
 * @param newData The new version of the data.
 * @param ignoreFields Fields to ignore during comparison.
 * @returns An object representing the changes between `oldData` and `newData`.
 */
export function buildChangedData<T extends Record<string, any>, K extends keyof T>(
  oldData: T,
  newData: T,
  ignoreFields: K[] = []
): ChangedData<T> {
  const dissimilarFields = findDissimilarFields(oldData, newData, ignoreFields as string[]);

  const changedData: ChangedData<T> = {} as any;

  dissimilarFields.forEach(field => {
    changedData[field] = { new: newData[field], old: oldData[field] };
  });

  return changedData;
}

export function isType<Type extends object>(
  obj: unknown,
  keysToCheck: (keyof Type)[]
): obj is Type {
  if (typeof obj !== 'object' || obj === null) return false;

  return keysToCheck.every(
    key => Object.prototype.hasOwnProperty.call(obj, key) && obj[key as string] !== undefined
  );
}
