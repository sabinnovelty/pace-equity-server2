import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { trimmedStringSchema } from '../../../../shared/validations';

const updatePortfolioConcentrationLimitSchema = z
  .object({ limit: z.number(), portfolioId: z.number(), ruleId: z.number() })
  .partial();

export class UpdatePortfolioConcentrationLimitBody extends createZodDto(
  updatePortfolioConcentrationLimitSchema
) {}
