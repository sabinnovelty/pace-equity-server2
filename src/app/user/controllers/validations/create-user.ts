import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { trimmedStringSchema } from '../../../../shared/validations';

const createUserDto = z.object({
  lastName: z.string(),
  firstName: z.string(),
  email: z.string().email(),
  middleName: z.string().optional(),
  dob: trimmedStringSchema.optional(),
});

export class CreateUserBody extends createZodDto(createUserDto) {}
