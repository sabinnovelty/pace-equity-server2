import { Reflector } from '@nestjs/core';
import { IS_ANONYMOUS_KEY } from '../decorators/anonymous';
import { UnauthorizedException } from '../../../shared/exception';
import { AuthEntity, HttpRequest, Maybe } from '../../../shared/types';
import { ConfigService, TokenHelper } from '../../../shared/abstractions';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ACCESS_TOKEN_COOKIE_KEY, AUTHORIZATION_HEADER } from '../../../shared/constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenHelper: TokenHelper,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAnonymous = this.reflector.getAllAndOverride<boolean>(IS_ANONYMOUS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<HttpRequest>();
    console.log('this.configService.auth', this.configService);
    const token = this._extractTokenFromCookie(request);
    const refreshToken = this._extractTokenFromCookie(request, 'rt');

    if (!token) {
      if (isAnonymous) return true;

      throw new UnauthorizedException();
    }

    const { isValid, decodedToken: authEntity } = this.tokenHelper.verify(
      token,
      this.configService.auth.authTokenSecret
    );

    if (!isValid) {
      if (isAnonymous) return true;

      throw new UnauthorizedException();
    }

    request.authEntity = authEntity as AuthEntity;
    request.isUnprotected = isAnonymous;

    return true;
  }

  private _extractToken(request: HttpRequest): Maybe<string> {
    return this._extractTokenFromHeader(request) ?? this._extractTokenFromCookie(request);
  }

  private _extractTokenFromHeader(request: HttpRequest): Maybe<string> {
    const authorizationHeader = request.headers[AUTHORIZATION_HEADER] as Maybe<string>;
    if (!authorizationHeader) return undefined;

    const [type, token] = authorizationHeader.split(' ');

    return type === 'Bearer' ? token : undefined;
  }

  private _extractTokenFromCookie(request: HttpRequest, cookieName = 'at'): Maybe<string> {
    return request.signedCookies[cookieName];
  }
}
