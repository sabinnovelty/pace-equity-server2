import { PinoLogger } from '../logger';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheImpl } from '../redis';
import { CryptoHelperImpl } from '../crypto';
import { CookieHelperImpl } from '../cookie';
import { JwtTokenHelperImpl } from '../token';
import { Global, Module } from '@nestjs/common';
import { MongoDbUnitOfWorkImpl } from '../mongo-db';
import {
  CookieHelper,
  CryptoHelper,
  Logger,
  TokenHelper,
  UnitOfWork,
} from '../../shared/abstractions';

@Global()
@Module({
  imports: [JwtModule],
  exports: [TokenHelper, CryptoHelper, CookieHelper, UnitOfWork, Logger, Cache],
  providers: [
    {
      provide: TokenHelper,
      useClass: JwtTokenHelperImpl,
    },
    {
      provide: CryptoHelper,
      useClass: CryptoHelperImpl,
    },
    {
      provide: CookieHelper,
      useClass: CookieHelperImpl,
    },
    {
      provide: UnitOfWork,
      useClass: MongoDbUnitOfWorkImpl,
    },
    {
      provide: Logger,
      useClass: PinoLogger,
    },
    {
      provide: Cache,
      useClass: RedisCacheImpl,
    },
  ],
})
export class ExternalLibModule {}
