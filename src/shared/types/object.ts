import { GetDTOKeys } from './nested-object-type';

export type AnyObj<T = any> = { [key: string]: T };

export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Blank<T extends string | number> = T | '' | 0;

export type ChangedData<T extends Record<string, any> = any> = {
  [P in GetDTOKeys<T>]: { old: any; new: any };
};
