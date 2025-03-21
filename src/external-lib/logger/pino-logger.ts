import pino, { Logger } from 'pino';
import { Injectable } from '@nestjs/common';
import { AnyObj } from '../../shared/types';
import { ConfigService } from '../../shared/abstractions';
import { Logger as AppLogger } from '../../shared/abstractions';

@Injectable()
export class PinoLogger implements AppLogger {
  private logger: Logger;

  constructor(configService: ConfigService) {
    this.logger = pino({
      ...(configService.app.isDebug && { level: 'debug' }),
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          colorizeObjects: true,
          translateTime: 'yyyy-dd-mm, h:MM:ss TT',
        },
      },
    });
  }

  info(message: string, meta?: AnyObj): void {
    this.logger.info(meta, message);
  }
  warn(message: string, meta?: AnyObj): void {
    this.logger.warn(meta, message);
  }
  error(message: string, meta?: AnyObj): void {
    this.logger.error(meta, message);
  }
  debug(message: string, meta?: AnyObj): void {
    this.logger.debug(meta, message);
  }
}
