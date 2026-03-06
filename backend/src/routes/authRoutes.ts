import express from 'express';
import { register, login, getAllUsers, changePassword } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all-users', getAllUsers);
router.post('/change-password', authenticateJWT, changePassword);

export default router;
