import { Injectable } from '@nestjs/common';
import { FindAllResponse } from '../../../shared/types';
import { PortfolioConcentrationLimitResponse } from './response/user-response';
import { PortfolioConcentrationLimitPresenter } from './abstractions/user-presenter';
import { PortfolioConcentrationLimit } from '../domain/core/entities/portfolio-concentration-limit';
import { EncryptionTypeMismatch } from '@aws-sdk/client-s3';

@Injectable()
export class DefaultPortfolioConcentrationLimitPresenter
  implements PortfolioConcentrationLimitPresenter
{
  domainToPresentation(domain: PortfolioConcentrationLimit): PortfolioConcentrationLimitResponse {
    return {
      id: domain.id,
      limit: domain.limit,
      portfolioId: domain.portfolioId,
      ruleId: domain.ruleId,
    };
  }

  findAllDomainToPresentation(
    domain: FindAllResponse<PortfolioConcentrationLimit>
  ): FindAllResponse<PortfolioConcentrationLimitResponse> {
    return domain.map(d => this.domainToPresentation(d));
  }
}
