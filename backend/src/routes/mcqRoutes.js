import { Router } from 'express';
import { attemptQuestion, attemptValidation, bookmark, bookmarkValidation, bookmarks, history } from '../controllers/mcqController.js';
import { validate } from '../middlewares/validate.js';

const router = Router();
router.post('/attempt', attemptValidation, validate, attemptQuestion);
router.get('/history', history);
router.post('/bookmark', bookmarkValidation, validate, bookmark);
router.get('/bookmarks', bookmarks);
export default router;
