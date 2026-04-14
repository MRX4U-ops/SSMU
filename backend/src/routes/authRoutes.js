import { Router } from 'express';
import { googleLogin, googleLoginValidation } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';

const router = Router();
router.post('/google-login', googleLoginValidation, validate, googleLogin);
export default router;
