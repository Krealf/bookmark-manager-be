import Router from 'express';

import { createBookmark } from './bookmark.controller';

// Создаём роутер
const router = Router();

router.post('/bookmarks', createBookmark);

export default router;
