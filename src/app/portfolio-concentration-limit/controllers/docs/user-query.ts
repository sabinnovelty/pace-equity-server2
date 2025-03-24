import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  CountQueryDoc,
  QueryDoc,
  QueryMatchTypeDoc,
} from '../../../../external-lib/nest-js/docs/query';

export function PortfolioConcentrationLimitQueryDoc() {
  return applyDecorators(
    QueryDoc(),
    QueryMatchTypeDoc(),
    PortfolioConcentrationLimitAdvancedFilterQueryDoc()
  );
}

export function PortfolioConcentrationLimitCountQueryDoc() {
  return applyDecorators(
    CountQueryDoc(),
    QueryMatchTypeDoc(),
    PortfolioConcentrationLimitAdvancedFilterQueryDoc()
  );
}

function PortfolioConcentrationLimitAdvancedFilterQueryDoc() {
  return applyDecorators(
    ApiQuery({ type: 'string', required: false, name: 'firstName' }),
    ApiQuery({ type: 'string', required: false, name: 'lastName' }),
    ApiQuery({ name: 'email', type: 'string', required: false })
  );
}
