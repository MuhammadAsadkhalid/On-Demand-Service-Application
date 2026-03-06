import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { getMyNotifications, markAsRead, getUnreadCount } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authenticateJWT, getMyNotifications);
router.get('/unread-count', authenticateJWT, getUnreadCount);
router.put('/:id/read', authenticateJWT, markAsRead);

export default router;
