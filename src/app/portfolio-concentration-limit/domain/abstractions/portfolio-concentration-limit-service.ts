import { BaseService } from '../../../../shared/abstractions';
import { CreatePortfolioConcentrationLimitDto } from '../dtos/create-user';
import { UpdatePortfolioConcentrationLimitDto } from '../dtos/update-user';
import { PortfolioConcentrationLimit } from '../core/entities/portfolio-concentration-limit';
import { PortfolioConcentrationLimitQueryOptions } from '../dtos/portfolio-concentration-limit-query';

export abstract class PortfolioConcentrationLimitService extends BaseService<
  PortfolioConcentrationLimit,
  CreatePortfolioConcentrationLimitDto,
  UpdatePortfolioConcentrationLimitDto,
  PortfolioConcentrationLimitQueryOptions
> {}
