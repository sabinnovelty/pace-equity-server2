import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepositoryImpl } from '../../../external-lib/postgres/base-repository-impl';
import { PortfolioConcentrationLimitPersistenceMapper } from './mappers/portfolio-concentration-limit-mapper';
import { PortfolioConcentrationLimitSchema } from './schemas/portfolio-concentration-limit-schema';
import {
  PortfolioConcentrationLimit,
  PortfolioConcentrationLimitResponseFormat,
} from '../domain/core/entities/portfolio-concentration-limit';
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
  async getPortfolioByIdFromStoredProcedure(
    id: number,
    query: PortfolioConcentrationLimitQueryOptions
  ): Promise<PortfolioConcentrationLimitResponseFormat> {
    try {
      let queryWarehouseIds: number[] = [];
      let queryPhaseNames: string[] = [];
      let { warehouseIds, phaseNames } = query;
      // If warehouseIds is a string, parse it into an array
      if (typeof warehouseIds === 'string') {
        queryWarehouseIds = JSON.parse(warehouseIds) as number[]; // Parse string to array
      } else if (Array.isArray(warehouseIds)) {
        queryWarehouseIds = warehouseIds;
      }
      // If phaseIds is a string, parse it into an array
      if (typeof phaseNames === 'string') {
        queryPhaseNames = JSON.parse(phaseNames) as string[]; // Parse string to array
      }
      console.log(query);

      const portfolioAmountRes = await this.dataSource.query(
        `SELECT * FROM public.fn_get_portfolio_total_v4($1, $2, $3)`,
        [id, queryPhaseNames, queryWarehouseIds]
      );

      const totalPortfolioAmount = portfolioAmountRes[0].total_portfolio_amount ?? 0;

      // call second and third sp for weighted average and details
      const [weightedAverage, concentrationLimitDetail] = await Promise.all([
        this.dataSource.query(`SELECT * FROM public.calculate_wa_ltv_v4($1, $2, $3, $4)`, [
          id,
          totalPortfolioAmount,
          queryPhaseNames,
          queryWarehouseIds,
        ]),
        this.dataSource.query(`SELECT * FROM public.fn_concentration_limit_v4($1, $2, $3, $4)`, [
          id,
          totalPortfolioAmount,
          queryPhaseNames,
          queryWarehouseIds,
        ]),
      ]);

      // check whether portfolio is Cut Carbon or not

      const portfolio = await this.dataSource.query(`SELECT * FROM portfolio where id=$1`, [id]);

      return {
        totalPortfolioAmount,
        concentrationLimit: concentrationLimitDetail,
        weightedAverage: weightedAverage[0]?.weighted_average,
        portfolioName: portfolio[0]?.name,
      };
    } catch (error) {
      throw new Error(`Error executing stored procedure: ${error.message}`);
    }
  }
}
