import { Router } from 'express';
import { registerUser, loginUser, getMe, updateMe } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

export default router; 