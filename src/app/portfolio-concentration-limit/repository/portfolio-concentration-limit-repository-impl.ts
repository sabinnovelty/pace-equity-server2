import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepositoryImpl } from '../../../external-lib/postgres/base-repository-impl';
import { PortfolioConcentrationLimitPersistenceMapper } from './mappers/user-persistence-mapper';
import { PortfolioConcentrationLimitSchema } from './schemas/portfolio-concentration-limit-schema';
import { PortfolioConcentrationLimit } from '../domain/core/entities/portfolio-concentration-limit';
import { PortfolioConcentrationLimitQueryOptions } from '../domain/dtos/portfolio-concentration-limit-query';
import { PortfolioConcentrationLimitRepository } from './abstractions/portfolio-concentration-limit-repository';

@Injectable()
export class PortfolioConcentrationLimitRepositoryImpl
  extends BaseRepositoryImpl<
    PortfolioConcentrationLimit,
    PortfolioConcentrationLimitSchema,
    PortfolioConcentrationLimitQueryOptions
  >
  implements PortfolioConcentrationLimitRepository
{
  constructor(
    protected mapper: PortfolioConcentrationLimitPersistenceMapper,
    @InjectRepository(PortfolioConcentrationLimitSchema)
    protected model: Repository<PortfolioConcentrationLimitSchema>,
    private dataSource: DataSource
  ) {
    super(model, mapper);
  }
  async getByIdFromStoredProcedure(id: number): Promise<PortfolioConcentrationLimit[]> {
    try {
      // const result = await this.dataSource.query(
      //   `CALL GetPortfolioConcentrationLimitById(?)`, // Adjust SP name
      //   [id]
      // );

      const result = [{ portfolioId: 1, limit: 100, ruleId: 1 }];
      // limit: number;
      // portfolioId: number;
      // ruleId: number;
      // Handle the result - assuming the stored procedure returns a dataset
      return [];
    } catch (error) {
      throw new Error(`Error executing stored procedure: ${error.message}`);
    }
  }
}
