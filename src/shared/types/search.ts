import { DeepPartial } from './object';

export interface IKeywordSearch {
  keyword?: string;
}

export type IAdvancedSearch<T> = DeepPartial<T>;
