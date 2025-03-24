import { BaseEntity } from '../../../../../shared/entities';

export class PortfolioConcentrationLimit extends BaseEntity {
  limit: number;
  portfolioId: number;
  ruleId: number;

  initialize(builder: { limit: number; portfolioId: number; ruleId: number }) {
    this.limit = builder.limit;
    this.portfolioId = builder.portfolioId;
    this.ruleId = builder.ruleId;
  }
}

export class PortfolioConcentrationLimitResponseFormat {
  totalPortfolioAmount: number;
  concentrationLimit: any[];
  weightedAverage: number;
  cirrusMajorityMetrics?: any;
  portfolioName: string;
}
