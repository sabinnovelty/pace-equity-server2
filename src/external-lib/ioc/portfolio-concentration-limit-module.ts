import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from '../../app/portfolio-concentration-limit/repository/schemas/rule-schema';
import { Portfolio } from '../../app/portfolio-concentration-limit/repository/schemas/portfolio-schema';
import { PortfolioConcentrationLimitPresenter } from '../../app/portfolio-concentration-limit/presenters/abstractions/user-presenter';
import { DefaultPortfolioConcentrationLimitPresenter } from '../../app/portfolio-concentration-limit/presenters/default-user-presenter';
import { PortfolioConcentrationLimitPersistenceMapper } from '../../app/portfolio-concentration-limit/repository/mappers/user-persistence-mapper';
import { PortfolioConcentrationLimitServiceImpl } from '../../app/portfolio-concentration-limit/domain/portfolio-concentration-limit-service-impl';
import { PortfolioConcentrationLimitSchema } from '../../app/portfolio-concentration-limit/repository/schemas/portfolio-concentration-limit-schema';
import { PortfolioConcentrationLimitController } from '../../app/portfolio-concentration-limit/controllers/portfolio-concentration-limit-controller';
import { PortfolioConcentrationLimitService } from '../../app/portfolio-concentration-limit/domain/abstractions/portfolio-concentration-limit-service';
import { PortfolioConcentrationLimitRepositoryImpl } from '../../app/portfolio-concentration-limit/repository/portfolio-concentration-limit-repository-impl';
import { PortfolioConcentrationLimitRepository } from '../../app/portfolio-concentration-limit/repository/abstractions/portfolio-concentration-limit-repository';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioConcentrationLimitSchema, Rule, Portfolio])],
  controllers: [PortfolioConcentrationLimitController],
  providers: [
    PortfolioConcentrationLimitPersistenceMapper,
    {
      provide: PortfolioConcentrationLimitService,
      useClass: PortfolioConcentrationLimitServiceImpl,
    },
    {
      provide: PortfolioConcentrationLimitRepository,
      useClass: PortfolioConcentrationLimitRepositoryImpl,
    },
    {
      provide: PortfolioConcentrationLimitPresenter,
      useClass: DefaultPortfolioConcentrationLimitPresenter,
    },
  ],
})
export class PortfolioConcentrationLimitModule {}
