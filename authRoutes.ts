import { Router } from 'express';
import { login, logout } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validators/authSchema';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

export default router;