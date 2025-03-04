import { Module } from '@nestjs/common';
import { PortfolioConcentrationLimitController } from './portfolio-concentration-limit.controller';
import { PortfolioConcentrationLimitService } from './portfolio-concentration-limit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioConcentrationLimit } from './entities/portfolio-concentration-limit.entity';
import { Rule } from './entities/rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioConcentrationLimit, Rule])],
  controllers: [PortfolioConcentrationLimitController],
  providers: [PortfolioConcentrationLimitService],
})
export class PortfolioConcentrationLimitModule {}
