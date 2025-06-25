import { Request, Response } from 'express';
import prisma from '../config/prisma';
import redis from '../config/redis';

export const getUsers = async (req: Request, res: Response) => {
  const cacheKey = 'users';

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const users = await prisma.user.findMany();
  await redis.set(cacheKey, JSON.stringify(users), { EX: 60 }); // 60 seconds

  return res.json(users);
};
