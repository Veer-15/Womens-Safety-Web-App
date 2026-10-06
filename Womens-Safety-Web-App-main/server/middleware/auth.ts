import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.ts';
import { User } from '../types.ts';

if (!process.env.JWT_SECRET) {
  console.warn('[SECURITY WARNING] JWT_SECRET env var is not set. Using insecure dev fallback — set a strong secret in .env for production.');
}
export const JWT_SECRET = process.env.JWT_SECRET ?? 'sakhi_dev_only_secret_do_not_use_in_prod';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = db.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
}
