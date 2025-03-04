import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioConcentrationLimitModule } from './modules/portfolio-concentration-limit/portfolio-concentration-limit.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtMiddleware } from './core/middlewares/jwt-parse.middleware';
import * as cookieParser from 'cookie-parser';
import { AppDataSource } from './config/data-source';

const dbConfig = require('../ormConfig.js');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({ ...AppDataSource.options }), // Load config dynamically
    }),
    PortfolioConcentrationLimitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(this.configService.get('COOKIE_SECRET')))
      .forRoutes('*');
    consumer.apply(JwtMiddleware).forRoutes('*'); // Parses JWT tokens from cookies
  }
}
