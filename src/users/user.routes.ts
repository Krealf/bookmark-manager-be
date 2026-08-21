import { Router } from 'express';

import AuthMiddleware from '../middleware/auth.js';
import {
  createUser,
  getDataUser,
  loginUser,
  logOutUser,
  refreshToken,
} from './user.controller.js';
import { userSchema, validate, verifyRefreshToken } from './user.validation.js';

const router = Router();

router.post('/auth/register', validate(userSchema), createUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logOutUser);

router.get('/auth/refresh', verifyRefreshToken, refreshToken);
router.get('/auth/me', AuthMiddleware, getDataUser);

export default router;
