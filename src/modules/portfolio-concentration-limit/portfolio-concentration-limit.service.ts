import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioConcentrationLimit } from './entities';

@Injectable()
export class PortfolioConcentrationLimitService {
  constructor(
    @InjectRepository(PortfolioConcentrationLimit)
    private repo: Repository<PortfolioConcentrationLimit>,
  ) {}

  getConcentrationLimitByPortfolioId(portfolioId: number) {
    return 'Portfolio concentration limit is coming soon';
    return this.repo.findOne({ where: { id: portfolioId } });
  }
}
