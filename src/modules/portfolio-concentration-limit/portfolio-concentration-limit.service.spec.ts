import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioConcentrationLimitService } from './portfolio-concentration-limit.service';

describe('PortfolioConcentrationLimitService', () => {
  let service: PortfolioConcentrationLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfolioConcentrationLimitService],
    }).compile();

    service = module.get<PortfolioConcentrationLimitService>(PortfolioConcentrationLimitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
