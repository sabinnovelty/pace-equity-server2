import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { querySchema } from '../../../../shared/validations';

const userQuerySchema = querySchema.merge(
  z.object({
    warehouseIds: z.array(z.number()).optional(),
    phaseIds: z.array(z.number()).optional(),
    portfolioId: z.number(),
  })
);

export class PortfolioConcentrationLimitQueryParams extends createZodDto(userQuerySchema) {}
