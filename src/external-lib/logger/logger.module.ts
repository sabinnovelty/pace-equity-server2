import { Module } from '@nestjs/common';
import { LatencyLogPublisherImpl } from '../../shared/messaging/latency-log-publisher-impl';
import { ExceptionLogPublisherImpl } from '../../shared/messaging/exception-log-publisher-impl';

@Module({
  exports: [ExceptionLogPublisherImpl, LatencyLogPublisherImpl],
  providers: [ExceptionLogPublisherImpl, LatencyLogPublisherImpl],
})
export class LoggerModule {}
