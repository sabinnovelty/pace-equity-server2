import { HttpRequest } from '../../../shared/domain/types/http';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthEntityDecorator = createParamDecorator((_: any, context: ExecutionContext) => {
  const request: HttpRequest = context.switchToHttp().getRequest();

  return request.authEntity;
});

export const AuthServiceDecorator = createParamDecorator((_: any, context: ExecutionContext) => {
  const request: HttpRequest = context.switchToHttp().getRequest();

  return request.authService;
});
