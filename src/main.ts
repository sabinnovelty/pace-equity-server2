import compression from 'compression';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { IAppConfig } from './config/type';
import { AppModule } from './app/app-module';
import { APP_NAME } from './shared/constants';
import { Logger } from './shared/abstractions';
import { patchNestJsSwagger } from 'nestjs-zod';
import { INestApplication } from '@nestjs/common';
import { registerMongoConnection } from './external-lib/mongo-db';
import { ConfigService } from './shared/abstractions/config-service';
import { createSwaggerDocument } from './external-lib/nest-js/docs/swagger';
import { HttpResponseInterceptor } from './external-lib/nest-js/interceptors';
import { getMongoModelsForRegistration } from './external-lib/mongo-db/register_models';
import { DomainExceptionFilter, ZodExceptionFilter } from './external-lib/nest-js/filters';
import { MongoDBExceptionFilter } from './external-lib/nest-js/filters/mongo-exception-filter';
import { DefaultExceptionFilter } from './external-lib/nest-js/filters/default-exception-filter';

class Application {
  constructor(private readonly app: INestApplication) {}

  async init() {
    this.app.setGlobalPrefix('api');

    this.app.use(cookieParser());
    this.app.use(compression()); //compresses responses with size > 1kb by default

    this._attachInterceptors();

    this._attachGlobalFilters();

    const configService = this.app.get(ConfigService);

    patchNestJsSwagger();
    createSwaggerDocument(this.app);

    registerMongoConnection(this.app, getMongoModelsForRegistration(this.app));

    await this._listen(configService.app);
  }

  private _attachInterceptors() {
    this.app.useGlobalInterceptors(new HttpResponseInterceptor());
  }

  private _attachGlobalFilters() {
    this.app.useGlobalFilters(
      new DefaultExceptionFilter(),
      new MongoDBExceptionFilter(),
      new ZodExceptionFilter(),
      new DomainExceptionFilter()
    );
  }

  private async _listen(appConfig: IAppConfig) {
    await this.app.listen(appConfig.port);

    const logger = this.app.get(Logger);
    logger.info(`${APP_NAME} API listening on port ${appConfig.port}`);
  }
}

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);

  const app = new Application(nestApp);

  await app.init();
}

bootstrap();
