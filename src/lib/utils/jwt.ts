import jwt from 'jsonwebtoken';
import { Cookie } from 'cookie';

export type JwtPayload = {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
};

export function parseAuthCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const cookies = Cookie.parse(cookieHeader);
  return cookies.authToken || null;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}