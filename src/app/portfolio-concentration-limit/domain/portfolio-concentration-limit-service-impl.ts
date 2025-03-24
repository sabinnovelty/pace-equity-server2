import { Injectable } from '@nestjs/common';
import { ProjectModule } from '../../../shared/enum';
import { errorMessage } from '../../../shared/constants';
import { formatModuleMessage } from '../../../shared/utils';
import { NotFoundException } from '../../../shared/exception';
import { CreatePortfolioConcentrationLimitDto } from './dtos/create-user';
import { UpdatePortfolioConcentrationLimitDto } from './dtos/update-user';
import { FindAllResponse, CountResponse, ServiceOption } from '../../../shared/types';
import { PortfolioConcentrationLimit } from './core/entities/portfolio-concentration-limit';
import { PortfolioConcentrationLimitQueryOptions } from './dtos/portfolio-concentration-limit-query';
import { PortfolioConcentrationLimitService } from './abstractions/portfolio-concentration-limit-service';
import { PortfolioConcentrationLimitRepository } from '../repository/abstractions/portfolio-concentration-limit-repository';

@Injectable()
export class PortfolioConcentrationLimitServiceImpl implements PortfolioConcentrationLimitService {
  constructor(private portfolioConcentrationRepository: PortfolioConcentrationLimitRepository) {}

  async create(
    createDto: CreatePortfolioConcentrationLimitDto,
    option: ServiceOption
  ): Promise<PortfolioConcentrationLimit> {
    const portfolioConcentrationLimit = new PortfolioConcentrationLimit();
    portfolioConcentrationLimit.initialize(createDto);

    const createdPortfolioConcentrationLimit = await this.portfolioConcentrationRepository.create(
      portfolioConcentrationLimit,
      option
    );

    return createdPortfolioConcentrationLimit;
  }

  //#region Get
  async count(
    query: PortfolioConcentrationLimitQueryOptions,
    option?: ServiceOption
  ): Promise<CountResponse> {
    return await this.portfolioConcentrationRepository.count(query, option);
  }

  // async get(
  //   query: PortfolioConcentrationLimitQueryOptions,
  //   option: ServiceOption
  // ): Promise<FindAllResponse<PortfolioConcentrationLimit>> {
  //   // return await this.portfolioConcentrationRepository.findAll(query, option);
  //   return 'Portfolio Concentration Limit from stored procedure is comming soon';
  // }
  async get(query: PortfolioConcentrationLimitQueryOptions, option: ServiceOption): Promise<any> {
    // return await this.portfolioConcentrationRepository.findAll(query, option);
    return { data: 'Portfolio Concentration Limit from stored procedure is comming soon' };
  }

  async getOneById(id: number, option?: ServiceOption): Promise<PortfolioConcentrationLimit> {
    const portfolioConcentrationLimit = await this.portfolioConcentrationRepository.findOneById(id);
    if (!portfolioConcentrationLimit)
      throw new NotFoundException(
        formatModuleMessage(
          errorMessage.MODULE_NOT_FOUND,
          ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT
        )
      );

    return portfolioConcentrationLimit;
  }

  async updateById(
    id: number,
    updateDto: UpdatePortfolioConcentrationLimitDto,
    option: ServiceOption
  ): Promise<PortfolioConcentrationLimit> {
    const updatedPortfolioConcentrationLimit =
      await this.portfolioConcentrationRepository.updateById(id, updateDto, option);
    if (!updatedPortfolioConcentrationLimit)
      throw new NotFoundException(
        formatModuleMessage(
          errorMessage.MODULE_NOT_FOUND,
          ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT
        )
      );

    return updatedPortfolioConcentrationLimit;
  }

  async deleteById(id: number, option: ServiceOption): Promise<void> {
    return await this.portfolioConcentrationRepository.deleteById(id, option);
  }
}
