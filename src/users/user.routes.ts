import { Router } from 'express';

import AuthMiddleware from '../middleware/auth';
import {
  createUser,
  getDataUser,
  loginUser,
  logOutUser,
  refreshToken,
} from './user.controller';
import { userSchema, validate, verifyRefreshToken } from './user.validation';

const router = Router();

router.post('/auth/register', validate(userSchema), createUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logOutUser);

router.get('/auth/refresh', verifyRefreshToken, refreshToken);
router.get('/auth/me', AuthMiddleware, getDataUser);

export default router;
