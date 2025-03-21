import { AuthEntity } from './auth';
import { Maybe, Nullable } from './object';
import { IncomingHttpHeaders } from 'http2';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';

export type HttpResponseError = {
  key?: string;
  logMessage?: any;
  displayMessage?: string;
};

export interface IHttpResponse<T = any> {
  data: Nullable<T>;
  message?: string;
  error?: HttpResponseError;
  statusCode?: number;
  timestamp?: Date;
}
export interface RequestHeaders extends IncomingHttpHeaders {}

export type HttpRequest = ExpressRequest & {
  authEntity: Maybe<AuthEntity>;
  headers: RequestHeaders;
  isUnprotected: boolean;
  refreshTokenPayload: Maybe<RefreshTokenPayload>;
  refreshToken: Maybe<string>;
};

export interface RefreshTokenPayload {
  tokenId: string;
  userId: string;
  iat?: number;
  exp?: number;
}

export type HttpResponse = ExpressResponse;
export type NextFunction = ExpressNextFunction;
