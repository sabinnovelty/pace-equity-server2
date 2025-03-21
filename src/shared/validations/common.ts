import { z } from 'zod';

export const stringBooleanSchema = z.string().transform(value => {
  if (value.toLowerCase() === 'true' || value == '1') {
    return true;
  } else if (value.toLowerCase() === 'false' || value == '0') {
    return false;
  }

  return undefined;
});

export const optionalStringNumberSchema = z
  .custom<string>()
  .refine(value => {
    if (!value) return true;

    return Number.isFinite(Number(value));
  }, 'The provided number is invalid')
  .transform(value => {
    if (!value) return undefined;

    return Number(value);
  });

export const dateSchema = z.date().or(z.string().pipe(z.coerce.date()));

export const addressSchema = z.object({
  zip: z.string(),
  city: z.string(),
  state: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  location: z
    .object({
      coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    })
    .optional(),
});

export const assignerSchema = z.object({
  id: z.string().optional(),
  at: dateSchema.optional(),
  by: z.string().optional(),
});

export const positiveNumberSchema = label =>
  z
    .string()
    .transform(val => parseFloat(val))
    .refine(val => val > 0, { message: `${label} must be a positive number.` });

export const latSchema = z
  .string()
  .transform(val => parseFloat(val))
  .refine(val => val >= -90 && val <= 90, { message: 'Latitude must be between -90 and 90.' });

export const lngSchema = z
  .string()
  .transform(val => parseFloat(val))
  .refine(val => val >= -180 && val <= 180, { message: 'Longitude must be between -180 and 180.' });

export const websiteSchema = z.string().optional();

export const trimmedStringSchema = z.string().trim();
