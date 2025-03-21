import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  CountQueryDoc,
  QueryDoc,
  QueryMatchTypeDoc,
} from '../../../../external-lib/nest-js/docs/query';

export function UserQueryDoc() {
  return applyDecorators(QueryDoc(), QueryMatchTypeDoc(), UserAdvancedFilterQueryDoc());
}

export function UserCountQueryDoc() {
  return applyDecorators(CountQueryDoc(), QueryMatchTypeDoc(), UserAdvancedFilterQueryDoc());
}

function UserAdvancedFilterQueryDoc() {
  return applyDecorators(
    ApiQuery({
      type: 'string',
      required: false,
      name: 'firstName',
    }),
    ApiQuery({
      type: 'string',
      required: false,
      name: 'lastName',
    }),
    ApiQuery({
      name: 'email',
      type: 'string',
      required: false,
    })
  );
}
