import express from 'express';
import { getAllUsers, blockUser, unblockUser, deleteUser, getProfile, updateProfile } from '../controllers/userController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateJWT, authorizeRoles('Admin'), getAllUsers);
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.patch('/block/:id', authenticateJWT, authorizeRoles('Admin'), blockUser);
router.patch('/unblock/:id', authenticateJWT, authorizeRoles('Admin'), unblockUser);
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), deleteUser);

export default router;
