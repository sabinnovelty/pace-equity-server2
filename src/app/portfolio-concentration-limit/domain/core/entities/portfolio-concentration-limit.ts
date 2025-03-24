import { Rule } from './rule';
import { Portfolio } from './portfolio';
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
