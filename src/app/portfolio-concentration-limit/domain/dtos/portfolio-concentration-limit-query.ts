import { IQuery } from '../../../../shared/types';

export type PortfolioConcentrationLimitQueryOptions = {
  warehouseIds?: number[];
  phaseIds?: number[];
  phaseNames?: string[];
} & IQuery;
