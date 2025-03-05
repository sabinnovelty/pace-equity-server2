import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto'; // Import crypto to generate UUID

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
    throw error;
  }
}

export function verifyRefreshToken(refreshToken: string) {
  try {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET_KEY); // Verifies JWT using secret key
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw error;
  }
}

export function generateAccessToken(payload: any, deviceId: string) {
  const finalPayload = {
    ...payload,
    ...identifyTokenPayload(deviceId),
  };
  return jwt.sign(finalPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_MIN || 5,
  });
}

function identifyTokenPayload(deviceId: string) {
  return {
    deviceId: deviceId ?? randomUUID(), // If deviceId is not provided, generate a random one
    tokenId: randomUUID(), // Generate a random tokenId
  };
}

export function generateRefreshToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: '7d',
  });
}
