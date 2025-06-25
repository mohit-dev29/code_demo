import { Router } from 'express';
import { getUsers } from '../controllers/userController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();
router.get('/', isAuthenticated, getUsers);

export default router;
