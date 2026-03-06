import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateJWT, authorizeRoles('Admin'), getDashboardStats);

export default router;
