import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken, setTokenInDB, validateToken } from '../services/authService';
import { getIO } from '../sockets/ioInstance'; // We will create this

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

  const token = generateToken(user);
  await setTokenInDB(user.id, token);

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // Set to true in production with HTTPS
  });

  return res.json({ message: 'Login successful' });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = validateToken(token);
      await setTokenInDB(decoded.userId, '');
    } catch (err) {
      // ignore
    }
  }

  // Inside your controller after DB update
  getIO().emit('userLoggedIn', { email: user.email });

  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
};
