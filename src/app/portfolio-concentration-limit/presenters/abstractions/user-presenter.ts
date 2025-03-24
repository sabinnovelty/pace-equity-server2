import { FindAllResponse } from '../../../../shared/types';
import { PortfolioConcentrationLimitResponse } from '../response/user-response';
import { PortfolioConcentrationLimit } from '../../domain/core/entities/portfolio-concentration-limit';

export abstract class PortfolioConcentrationLimitPresenter {
  abstract domainToPresentation(
    domain: PortfolioConcentrationLimit
  ): PortfolioConcentrationLimitResponse;
  abstract findAllDomainToPresentation(
    domain: FindAllResponse<PortfolioConcentrationLimit>
  ): FindAllResponse<PortfolioConcentrationLimitResponse>;
}
