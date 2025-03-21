import { IQuery } from '../../../../shared/types';

export type UserQueryOptions = {
  firstName?: string;
  lastName?: string;
  email?: string;
} & IQuery;
