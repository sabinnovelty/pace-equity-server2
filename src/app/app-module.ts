import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ZodValidationPipe } from 'nestjs-zod';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app-controller';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigService } from '../shared/abstractions';
import { ConfigModule } from '../external-lib/ioc/config-module';
import { PostgresConnection } from '../external-lib/postgres/connection';
import { ExternalLibModule } from '../external-lib/ioc/external-lib-module';
import { AuthenticationGuard } from '../external-lib/nest-js/guards/authentication-guard';
import { PortfolioConcentrationLimitModule } from '../external-lib/ioc/portfolio-concentration-limit-module';
import { PortfolioConcentrationLimitController } from './portfolio-concentration-limit/controllers/portfolio-concentration-limit-controller';

@Module({
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
  imports: [
    PortfolioConcentrationLimitModule,
    JwtModule,
    // DB module
    // config module
    ConfigModule,
    // infrastructure module
    ExternalLibModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigService
      useFactory: async (configService: ConfigService) => {
        const postgresConnection = new PostgresConnection(configService);
        const dataSource = await postgresConnection.connect(); // Initialize DB connection

        return { ...dataSource.options };
      },
    }),
  ],
})
export class AppModule {}
