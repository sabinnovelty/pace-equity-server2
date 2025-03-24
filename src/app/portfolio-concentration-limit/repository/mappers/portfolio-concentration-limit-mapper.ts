import { Injectable } from '@nestjs/common';
import { BasePersistenceMapper } from '../../../../shared/abstractions';
import { PortfolioConcentrationLimitSchema } from '../schemas/portfolio-concentration-limit-schema';
import { PortfolioConcentrationLimit } from '../../domain/core/entities/portfolio-concentration-limit';

@Injectable()
export class PortfolioConcentrationLimitPersistenceMapper extends BasePersistenceMapper<
  PortfolioConcentrationLimit,
  PortfolioConcentrationLimitSchema
> {
  domainToPersistence(domain: PortfolioConcentrationLimit): PortfolioConcentrationLimitSchema {
    throw new Error('Method not implemented.');
  }

  persistenceToDomain(persistence: PortfolioConcentrationLimitSchema): PortfolioConcentrationLimit {
    throw new Error('Method not implemented.');
  }
}
