import { ProjectModule } from '../../../shared/enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UnitOfWork } from '../../../shared/abstractions';
import { successMessage } from '../../../shared/constants';
import { AuthEntityDecorator } from '../../../external-lib/nest-js/decorators';
import { buildHttpResponse, formatModuleMessage } from '../../../shared/utils';
import { CreatePortfolioConcentrationLimitBody } from './validations/create-user';
import { UpdatePortfolioConcentrationLimitBody } from './validations/update-user';
import { PortfolioConcentrationLimitQueryParams } from './validations/user-query';
import { PortfolioConcentrationLimitResponse } from '../presenters/response/user-response';
import { AuthenticationGuard } from '../../../external-lib/nest-js/guards/authentication-guard';
import { PortfolioConcentrationLimitPresenter } from '../presenters/abstractions/user-presenter';
import type {
  AuthEntity,
  CountResponse,
  FindAllResponse,
  IHttpResponse,
} from '../../../shared/types';
import { PortfolioConcentrationLimitService } from '../domain/abstractions/portfolio-concentration-limit-service';
import {
  PortfolioConcentrationLimitCountQueryDoc,
  PortfolioConcentrationLimitQueryDoc,
} from './docs/user-query';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

@ApiTags(ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT)
@Controller({ path: 'portfolio-concentration-limit' })
export class PortfolioConcentrationLimitController {
  constructor(
    private portfolioConcentrationLimitService: PortfolioConcentrationLimitService,
    private unitOfWork: UnitOfWork,
    private userPresenter: PortfolioConcentrationLimitPresenter
  ) {}

  @ApiBearerAuth('JWT')
  @Post()
  async createPortfolioConcentrationLimit(
    @Body() body: CreatePortfolioConcentrationLimitBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<PortfolioConcentrationLimitResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.portfolioConcentrationLimitService.create(body, { session, authEntity })
      );

      return buildHttpResponse(
        responseData,
        formatModuleMessage(
          successMessage.MODULE_CREATE_SUCCESS,
          ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT
        )
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Get('/count')
  @PortfolioConcentrationLimitCountQueryDoc()
  async count(
    @Query() query: PortfolioConcentrationLimitQueryParams,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<CountResponse>> {
    const responseData = await this.portfolioConcentrationLimitService.count(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(
        successMessage.MODULE_COUNT_FETCH_SUCCESS,
        ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT
      )
    );
  }

  @ApiBearerAuth('JWT')
  @Get()
  @PortfolioConcentrationLimitQueryDoc()
  async get(
    @Query() query: PortfolioConcentrationLimitQueryParams,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<FindAllResponse<PortfolioConcentrationLimitResponse>>> {
    const responseData = this.userPresenter.findAllDomainToPresentation(
      await this.portfolioConcentrationLimitService.get(query, { authEntity })
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(
        successMessage.MODULE_FETCH_SUCCESS,
        ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT
      )
    );
  }

  // @ApiBearerAuth('JWT')
  @Get('/:id')
  async getOneById(
    @Param('id') id: string
    // @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<PortfolioConcentrationLimitResponse>> {
    // const responseData = this.userPresenter.domainToPresentation(
    //   await this.portfolioConcentrationLimitService.getOneById(+id, { authEntity })
    // );
    console.log('id', id);
    const response: any = await this.portfolioConcentrationLimitService.get({ portfolioId: +id });

    return response;
    // return buildHttpResponse(
    //   responseData,
    //   formatModuleMessage(
    //     successMessage.MODULE_VIEW_SUCCESS,
    //     ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT
    //   )
    // );
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdatePortfolioConcentrationLimitBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<PortfolioConcentrationLimitResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.portfolioConcentrationLimitService.updateById(+id, body, { session, authEntity })
      );

      return buildHttpResponse(
        responseData,
        formatModuleMessage(
          successMessage.MODULE_UPDATE_SUCCESS,
          ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT
        )
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Delete('/:id')
  async deleteById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.portfolioConcentrationLimitService.deleteById(+id, {
        session,
        authEntity,
      });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(
          successMessage.MODULE_DELETE_SUCCESS,
          ProjectModule.PORTFOLIO_CONCENTRATION_LIMIT
        )
      );
    });
  }
}
