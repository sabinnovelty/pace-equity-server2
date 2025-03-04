import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { PortfolioConcentrationLimitService } from './portfolio-concentration-limit.service';
import { CurrentUser } from 'src/core/decorators/current-user-decorator';
import { Request } from 'express';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { AuthGuard } from 'src/core/guards/auth.guard';

@Controller({ path: 'portfolio-concentration-limit', version: '1' })
@UseGuards(AuthGuard)
export class PortfolioConcentrationLimitController {
  constructor(
    private readonly portfolioConcentrationLimitService: PortfolioConcentrationLimitService,
  ) {}

  @Get(':portfolioId')
  @UseGuards(AdminGuard)
  getConcentrationLimitByPortfolioId(
    @CurrentUser() user: string,
    @Param('portfolioId') portfolioId: number,
    @Req() req: Request,
  ) {
    return this.portfolioConcentrationLimitService.getConcentrationLimitByPortfolioId(
      portfolioId,
    );
  }
}
