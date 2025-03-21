import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { querySchema } from '../../../../shared/validations';

const userQuerySchema = querySchema.merge(
  z.object({
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  })
);

export class UserQueryParams extends createZodDto(userQuerySchema) {}
