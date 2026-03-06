import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({
            where: { id, user_id: req.user.id }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.is_read = true;
        await notification.save();

        res.json({ message: 'Notification marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
    try {
        const count = await Notification.count({
            where: { user_id: req.user.id, is_read: false }
        });
        res.json({ count });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
