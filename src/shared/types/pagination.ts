export interface IPagination {
  limit?: number;
  sortBy?: string;
}

export interface IOffsetPagination extends IPagination {
  offset?: number;
}

export interface IPaginationReturnValue {
  page: number;
  limit: number;
}

//this interface is used for offset pagination
export interface IPaginationQuery extends IPagination {
  page?: number;
}

export interface ICursorPagination extends IPagination {
  nextToken?: string;
  tokenRefField?: string;
}
