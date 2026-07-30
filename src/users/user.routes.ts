import Router from 'express';

import AuthMiddleware from '../middleware/auth';
import {
  createUser,
  getDataUser,
  loginUser,
  logOutUser,
} from './user.controller';

const router = Router();

router.post('/auth/register', createUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logOutUser);
router.get('/auth/me', AuthMiddleware, getDataUser);

export default router;
