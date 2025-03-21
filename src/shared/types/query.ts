import { MatchType } from '../enum';
import { IKeywordSearch } from './search';
import { AnyObj, DeepPartial } from './object';
import { IPaginationQuery } from './pagination';

export type IQuery = IPaginationQuery & IKeywordSearch & AnyObj & QueryMatchType;

export type DBQuery<Schema = any> = IQuery & DeepPartial<Schema>;

export type FindAllResponse<T = any> = T[];

export type QueryMatchType = {
  /** Specifies whether property-based filters should be matched wholly or partially */
  propertyMatchType?: MatchType;
};

export type PaginatedResponse<T = any> = {
  rows: T[];
  metaInfo: PaginationMetaInfo;
};

export interface PaginationMetaInfo {
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
}

export type CountResponse = {
  count: number;
};
