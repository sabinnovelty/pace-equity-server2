import { ApiTags } from '@nestjs/swagger';
import { APP_NAME } from '../shared/constants';
import { Controller, Get } from '@nestjs/common';
import { buildHttpResponse } from '../shared/utils';
import type { IHttpResponse } from '../shared/types';
import { Anonymous } from '../external-lib/nest-js/decorators';

@Controller()
@ApiTags('App')
export class AppController {
  constructor() {}

  @Get('/health')
  @Anonymous()
  getHealth(): IHttpResponse {
    return buildHttpResponse(null, `${APP_NAME} API up and running!`);
  }
}
