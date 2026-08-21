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

router.post('/bookmarks', createBookmark);
router.post('/bookmarks/:id/visit', trackBookmarkVisit);
router.patch('/bookmarks/:id', updateBookmark);
router.get('/bookmarks', getAllBookmarks);
router.delete('/bookmarks/:id', deleteBookmark);

export default router;
