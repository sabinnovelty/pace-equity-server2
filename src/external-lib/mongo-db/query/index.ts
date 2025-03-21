import { SOFT_DELETION_FIELD } from '../../../shared/constants';

export * from './pagination-pipeline';

export const conditionToExcludeSoftDeleted = {
  $or: [{ [SOFT_DELETION_FIELD]: { $exists: false } }, { [SOFT_DELETION_FIELD]: { $eq: null } }],
};
