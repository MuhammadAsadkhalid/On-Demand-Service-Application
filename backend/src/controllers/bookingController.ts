import { Request, Response } from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { AuthRequest } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { service_id, booking_date, booking_time, total_price } = req.body;
        const user_id = req.user.id;

        console.log('Creating booking for user:', user_id, 'service:', service_id);

        const booking = await Booking.create({
            user_id,
            service_id,
            booking_date,
            booking_time,
            total_price: parseFloat(total_price),
            status: 'Pending'
        });

        res.status(201).json(booking);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
        const user_id = req.user.id;
        const bookings = await Booking.findAll({
            where: { user_id },
            include: [Service, { model: User, as: 'Provider' }]
        });
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, provider_id } = req.body;

        const booking = await Booking.findByPk(id as string);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        if (status) booking.status = status;
        if (provider_id) booking.provider_id = provider_id;

        await booking.save();

        // Create notification for user
        if (status === 'Accepted' || status === 'Rejected') {
            await Notification.create({
                user_id: booking.user_id,
                title: `Booking ${status}`,
                message: `Your booking for service ${booking.id} has been ${status.toLowerCase()}.`
            });
        }

        res.json(booking);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'Customer' },
                { model: User, as: 'Provider' },
                Service
            ]
        });
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id as string);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        await booking.destroy();
        res.json({ message: 'Booking deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
