import { Global, Module } from '@nestjs/common';
import { ConfigService } from '../../shared/abstractions';
import { ConfigServiceImpl } from '../../config/config-service';

@Global()
@Module({
  exports: [ConfigService],
  providers: [
    {
      useClass: ConfigServiceImpl,
      provide: ConfigService,
    },
  ],
})
export class ConfigModule {}
