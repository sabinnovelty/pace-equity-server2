import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { trimmedStringSchema } from '../../../../shared/validations';

const updateUserSchema = z
  .object({
    dob: trimmedStringSchema,
    email: z.string(),
    lastName: z.string(),
    firstName: z.string(),
    middleName: z.string(),
  })
  .partial();

export class UpdateUserBody extends createZodDto(updateUserSchema) {}
