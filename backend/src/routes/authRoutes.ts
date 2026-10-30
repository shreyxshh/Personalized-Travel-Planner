import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { userRegisterSchema, userLoginSchema } from '../schemas/index.js';

export const authRoutes = Router();

authRoutes.post('/api/v1/auth/register', validateBody(userRegisterSchema), register);
authRoutes.post('/api/v1/auth/login', validateBody(userLoginSchema), login);
authRoutes.get('/api/v1/auth/me', authenticate, getMe);
