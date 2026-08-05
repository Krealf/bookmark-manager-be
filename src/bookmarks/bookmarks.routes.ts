import { Router } from 'express';

import { createBookmark, getAllBookmarks } from './bookmark.controller';

// Создаём роутер
const router = Router();

router.post('/api/bookmarks', createBookmark);
router.get('/api/bookmarks', getAllBookmarks);

export default router;
