import { HttpRequest } from '../../../shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshTokenPayloadDecorator = createParamDecorator(
  (_: any, context: ExecutionContext) => {
    const request: HttpRequest = context.switchToHttp().getRequest();

    return request.refreshTokenPayload;
  }
);
