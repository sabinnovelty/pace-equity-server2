import { BaseRepository } from '../../../../shared/abstractions';
import { PortfolioConcentrationLimit } from '../../domain/core/entities/portfolio-concentration-limit';
import { PortfolioConcentrationLimitQueryOptions } from '../../domain/dtos/portfolio-concentration-limit-query';

export abstract class PortfolioConcentrationLimitRepository extends BaseRepository<
  PortfolioConcentrationLimit,
  PortfolioConcentrationLimitQueryOptions
> {
  // abstract getPortfolioFromStoredProcedure(id: number): Promise<PortfolioConcentrationLimit[]>;
  abstract getPortfolioByIdFromStoredProcedure(
    id: number,
    query: PortfolioConcentrationLimitQueryOptions
  ): Promise<any>;
}
