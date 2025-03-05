import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  generateAccessToken,
  verifyRefreshToken,
  verifyToken,
} from '../common/utils/jwt.utils';
import { UserRepository } from 'src/modules/user/user.repository';

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Jwt middleware is called');
    // this.userRepository.findUserById(1);
    const accessToken = req.signedCookies?.at; // Extract from signed cookies
    const refreshToken = req.signedCookies?.rt; // Extract from signed cookies

    if (!accessToken) {
      throw new HttpException('Token is missing', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decodedToken = verifyToken(accessToken);
      console.log('tokenVerification', decodedToken);

      req.currentUser = decodedToken;
      return next();
    } catch (error) {
      if (error?.message == 'jwt expired') {
        console.log('Access token expired, verifying refresh token...');
        if (!refreshToken) {
          throw new HttpException(
            'Refresh token is missing',
            HttpStatus.UNAUTHORIZED,
          );
        }
        try {
          // ✅ Verify Refresh Token
          const decodedRefreshToken = verifyRefreshToken(refreshToken);
          console.log('Refresh token verified:', decodedRefreshToken);

          const user = await this.userRepository.findUserById(
            decodedRefreshToken.userId,
          );

          const newAccessToken = generateAccessToken(
            user,
            decodedRefreshToken.deviceId,
          );
          if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
          }
          req.currentUser = user;
          res.cookie('at', newAccessToken, {
            httpOnly: true, // To prevent JavaScript from reading the cookie
            secure: process.env.NODE_ENV === 'production', // Set true for production (over HTTPS)
            sameSite:
              process.env.NODE_ENV === 'localhost' ||
              process.env.NODE_ENV === 'development'
                ? 'none'
                : 'strict', // To prevent CSRF
            path: '/', // Path to send the cookie to
            signed: true, // To sign the cookie
            maxAge: 10 * 60 * 1000,
          });
          next();
        } catch (err) {
          throw new HttpException(
            'Invalid refresh token',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
