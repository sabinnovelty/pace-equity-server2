import { ProjectModule } from '../../../shared/enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UnitOfWork } from '../../../shared/abstractions';
import { CreateUserBody } from './validations/create-user';
import { UpdateUserBody } from './validations/update-user';
import { UserQueryParams } from './validations/user-query';
import { successMessage } from '../../../shared/constants';
import { UserService } from '../domain/abstractions/user-service';
import { UserResponse } from '../presenters/response/user-response';
import { UserCountQueryDoc, UserQueryDoc } from './docs/user-query';
import { UserPresenter } from '../presenters/abstractions/user-presenter';
import { AuthEntityDecorator } from '../../../external-lib/nest-js/decorators';
import { buildHttpResponse, formatModuleMessage } from '../../../shared/utils';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import type {
  AuthEntity,
  CountResponse,
  FindAllResponse,
  IHttpResponse,
} from '../../../shared/types';

@ApiTags(ProjectModule.USER)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private unitOfWork: UnitOfWork,
    private userPresenter: UserPresenter
  ) {}

  @ApiBearerAuth('JWT')
  @Post()
  async createUser(
    @Body() body: CreateUserBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.userService.create(body, { session, authEntity })
      );

      return buildHttpResponse(
        responseData,
        formatModuleMessage(successMessage.MODULE_CREATE_SUCCESS, ProjectModule.USER)
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Get('/count')
  @UserCountQueryDoc()
  async count(
    @Query() query: UserQueryParams,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<CountResponse>> {
    const responseData = await this.userService.count(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(successMessage.MODULE_COUNT_FETCH_SUCCESS, ProjectModule.USER)
    );
  }

  @ApiBearerAuth('JWT')
  @Get()
  @UserQueryDoc()
  async get(
    @Query() query: UserQueryParams,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<FindAllResponse<UserResponse>>> {
    const responseData = this.userPresenter.findAllDomainToPresentation(
      await this.userService.get(query, { authEntity })
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(successMessage.MODULE_FETCH_SUCCESS, ProjectModule.USER)
    );
  }

  @ApiBearerAuth('JWT')
  @Get('/:id')
  async getOneById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserResponse>> {
    const responseData = this.userPresenter.domainToPresentation(
      await this.userService.getOneById(id, { authEntity })
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(successMessage.MODULE_VIEW_SUCCESS, ProjectModule.USER)
    );
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateUserBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.userService.updateById(id, body, { session, authEntity })
      );

      return buildHttpResponse(
        responseData,
        formatModuleMessage(successMessage.MODULE_UPDATE_SUCCESS, ProjectModule.USER)
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
      const responseData = await this.userService.deleteById(id, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(successMessage.MODULE_DELETE_SUCCESS, ProjectModule.USER)
      );
    });
  }
}
