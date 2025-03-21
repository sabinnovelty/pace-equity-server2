import { SOFT_DELETION_FIELD } from '../../../shared/constants';
import { AdminAssigner, Assigner } from '../../../shared/types';

export interface CommonSchema {
  _id?: string;
  created?: Assigner | AdminAssigner;
}

export interface BaseSchema extends CommonSchema {
  created?: Assigner;
  updated?: Assigner;
  [SOFT_DELETION_FIELD]?: Assigner; //Soft deletion field
}

export interface AdminBaseSchema extends CommonSchema {
  created?: AdminAssigner;
}
