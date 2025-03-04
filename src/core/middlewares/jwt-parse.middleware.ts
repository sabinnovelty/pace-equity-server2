import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../common/utils/jwt.utils';

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Jwt middleware is called');
    const accessToken = req.signedCookies?.at; // Extract from signed cookies
    const refreshToken = req.signedCookies?.rt; // Extract from signed cookies

    if (!accessToken) {
      throw new HttpException('Token is missing', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decodedToken = verifyToken(accessToken);
      console.log('tokenVerification', decodedToken);

      if (!decodedToken) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      req.currentUser = decodedToken;
      req.currentUser.role = 'admin';
      next();
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
