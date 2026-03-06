import { Response } from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Role from '../models/Role.js';
import { AuthRequest } from '../middleware/auth.js';
import { Op } from 'sequelize';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        // Find Admin Role ID
        const adminRole = await Role.findOne({ where: { name: 'Admin' } });

        // Count users excluding Admins
        const totalUsers = await User.count({
            where: {
                role_id: { [Op.ne]: adminRole?.id || 0 }
            }
        });

        // Count only accepted bookings
        const totalBookings = await Booking.count({ where: { status: 'Accepted' } });

        // Count active and frozen services
        const activeServices = await Service.count({ where: { is_active: true } });
        const frozenServices = await Service.count({ where: { is_active: false } });

        // Sum total_price of only accepted bookings
        const totalSales = await Booking.sum('total_price', { where: { status: 'Accepted' } }) || 0;

        // Current month and last month calculation for trends
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentMonthBookings = await Booking.count({
            where: {
                createdAt: { [Op.gte]: firstDayOfMonth }
            }
        });

        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthBookings = await Booking.count({
            where: {
                createdAt: {
                    [Op.gte]: lastMonth,
                    [Op.lt]: firstDayOfMonth
                }
            }
        });

        let bookingsTrend = 0;
        if (lastMonthBookings > 0) {
            bookingsTrend = Math.round(((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100);
        } else if (currentMonthBookings > 0) {
            bookingsTrend = 100;
        }

        res.json({
            totalUsers,
            totalBookings,
            activeServices,
            frozenServices,
            totalSales,
            bookingsTrend: `${bookingsTrend > 0 ? '+' : ''}${bookingsTrend}%`,
            salesTrend: '+0%' // Can implement similarly if needed
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
