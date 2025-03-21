import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AUTHORIZATION_HEADER, BasicAuthPayload, HttpRequest } from '../../../shared';

export const BasicAuthPayloadDecorator = createParamDecorator(
  (_: any, context: ExecutionContext) => {
    const request: HttpRequest = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers[AUTHORIZATION_HEADER];

    if (!authorizationHeader) return;

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Basic' || !token) return;

    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');

    const [username, password] = decodedToken.split(':');

    if (!username || !password) return;

    return { username, password } as BasicAuthPayload;
  }
);
