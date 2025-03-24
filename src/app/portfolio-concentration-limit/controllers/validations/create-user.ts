import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const createPortfolioConcentrationLimitDto = z.object({
  limit: z.number(),
  portfolioId: z.number(),
  ruleId: z.number(),
});

export class CreatePortfolioConcentrationLimitBody extends createZodDto(
  createPortfolioConcentrationLimitDto
) {}
