import { BaseEntity } from '../../../../../shared/entities';
import { PortfolioConcentrationLimit } from './portfolio-concentration-limit';

export class Rule extends BaseEntity {
  name: string;
  description: string;
  portfolioConcentrationLimit: PortfolioConcentrationLimit;

  initialize(builder: {
    name: string;
    description: string;
    portfolioConcentrationLimit: PortfolioConcentrationLimit;
  }) {
    this.name = builder.name;
    this.description = builder.description;
    this.portfolioConcentrationLimit = builder.portfolioConcentrationLimit;
  }
}
