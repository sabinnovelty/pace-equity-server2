import { BaseEntity } from '../../../../../shared/entities';
import { PortfolioConcentrationLimit } from './portfolio-concentration-limit';

export class Portfolio extends BaseEntity {
  uuid: string;
  code: string;
  name: string;
  description?: string;
  investorApprovals?: string;
  paymentRemittanceInstruction?: string;
  portfolioConcentrationLimits: PortfolioConcentrationLimit[];

  initialize(builder: {
    uuid: string;
    code: string;
    name: string;
    description: string;
    investorApprovals?: string;
    paymentRemittanceInstruction?: string;
    portfolioConcentrationLimits?: PortfolioConcentrationLimit[];
  }) {
    this.uuid = builder.uuid;
    this.code = builder.code;
    this.name = builder.name;
    this.description = builder.description;
    this.investorApprovals = builder.investorApprovals;
    this.paymentRemittanceInstruction = builder.paymentRemittanceInstruction;
    this.portfolioConcentrationLimits = builder.portfolioConcentrationLimits || [];
  }

  addConcentrationLimit(limit: PortfolioConcentrationLimit): void {
    this.portfolioConcentrationLimits.push(limit);
  }
}
