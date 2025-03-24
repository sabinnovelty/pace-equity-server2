import { PortfolioConcentrationLimit } from '../../app/portfolio-concentration-limit/domain/core/entities/portfolio-concentration-limit';

export abstract class PortfolioConcentrationLimitEvent {
  constructor(
    public user: PortfolioConcentrationLimit,
    public createdAt: Date
  ) {}
}
