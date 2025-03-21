import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app-controller';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongoDbModule } from '../external-lib/mongo-db';
import { UserModule } from '../external-lib/ioc/user-module';
import { ConfigModule } from '../external-lib/ioc/config-module';
import { ExternalLibModule } from '../external-lib/ioc/external-lib-module';
import { AuthenticationGuard } from '../external-lib/nest-js/guards/authentication-guard';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  imports: [
    UserModule,
    JwtModule,
    // DB module
    MongoDbModule,
    // config module
    ConfigModule,
    // infrastructure module
    ExternalLibModule,
  ],
})
export class AppModule {}
