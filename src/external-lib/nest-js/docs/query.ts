import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { MatchType } from '../../../shared/enum';

export function QueryDoc() {
  return applyDecorators(PaginationQueryDoc(), KeywordQueryDoc());
}

export function CountQueryDoc() {
  return applyDecorators(KeywordQueryDoc());
}

export function QueryMatchTypeDoc() {
  return applyDecorators(
    ApiQuery({
      type: 'string',
      required: false,
      name: 'propertyMatchType',
      enum: Object.values(MatchType),
    })
  );
}

export function PaginationQueryDoc() {
  return applyDecorators(
    ApiQuery({ name: 'limit', type: 'number', required: false }),
    ApiQuery({ name: 'page', type: 'number', required: false }),
    ApiQuery({ name: 'sortBy', type: 'string', required: false })
  );
}

export function KeywordQueryDoc() {
  return applyDecorators(
    ApiQuery({
      name: 'keyword',
      required: false,
    })
  );
}
