import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { TokenHelper } from '../../shared/abstractions';

@Injectable()
export class JwtTokenHelperImpl implements TokenHelper {
  constructor(private jwtService: JwtService) {}

  generate(payload: any, secret: string, expiryInMinutes?: number) {
    return this.jwtService.sign(payload, {
      secret,
      ...(expiryInMinutes && { expiresIn: expiryInMinutes * 60 }),
    });
  }

  verify(token: string, secret: string) {
    const decodedToken = this.jwtService.decode(token);
    try {
      this.jwtService.verify(token, { secret: secret });

      return {
        decodedToken,
        isValid: true,
      };
    } catch (error: any) {
      return {
        decodedToken,
        error: error,
        isValid: false,
      };
    }
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }
}
