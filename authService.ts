import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (user: User) => {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const validateToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
};

export const setTokenInDB = async (userId: number, token: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { token },
  });
};

export const checkTokenMatch = async (userId: number, token: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.token === token;
};
