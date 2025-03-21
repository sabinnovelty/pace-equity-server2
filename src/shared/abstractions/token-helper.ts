import { AnyObj } from '../types/object';

export abstract class TokenHelper {
  abstract generate(payload: string | AnyObj, secret: string, expiryInMinutes?: number): string;
  abstract verify<ReturnType>(
    token: string,
    secret: string
  ): {
    isValid: boolean;
    error?: Error;
    decodedToken: ReturnType;
  };
  abstract decode<ReturnType>(token: string): ReturnType;
}
