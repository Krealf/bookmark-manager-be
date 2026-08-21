import { Router } from 'express';

import {
  createBookmark,
  deleteBookmark,
  getAllBookmarks,
  trackBookmarkVisit,
  updateBookmark,
} from './bookmark.controller.js';

// Создаём роутер
const router = Router();

router.post('/api/bookmarks', createBookmark);
router.post('/api/bookmarks/:id/visit', trackBookmarkVisit);
router.patch('/api/bookmarks/:id', updateBookmark);
router.get('/api/bookmarks', getAllBookmarks);
router.delete('/api/bookmarks/:id', deleteBookmark);

export default router;
