import * as jwt from 'jsonwebtoken';

export function decodeToken(token: string) {
  try {
    return jwt.decode(token); // Decodes the JWT without verification
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verifies JWT using secret key
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}
