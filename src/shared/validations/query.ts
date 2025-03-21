import { z } from 'zod';
import { MatchType } from '../enum';
import { createZodDto } from 'nestjs-zod';
import { optionalStringNumberSchema, trimmedStringSchema } from './common';

export const paginatedQuerySchema = z
  .object({
    sortBy: z.string(),
    page: optionalStringNumberSchema,
    limit: optionalStringNumberSchema,
  })
  .partial();

export const keywordQuerySchema = z
  .object({
    keyword: trimmedStringSchema,
  })
  .partial();

export const querySchema = paginatedQuerySchema.merge(keywordQuerySchema).merge(
  z.object({
    propertyMatchType: z.nativeEnum(MatchType).optional(),
  })
);

export class PaginatedQueryParams extends createZodDto(paginatedQuerySchema) {}
export class KeywordQueryParams extends createZodDto(keywordQuerySchema) {}
export class QueryParams extends createZodDto(querySchema) {}
