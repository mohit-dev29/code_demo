import { Request, Response, NextFunction } from 'express';
import { validateToken, checkTokenMatch } from '../services/authService';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = validateToken(token);
    const isSameToken = await checkTokenMatch(decoded.userId, token);
    if (!isSameToken) throw new Error('Invalid session');

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
