import express from 'express';
import { createBooking, getUserBookings, updateBookingStatus, getAllBookings, deleteBooking } from '../controllers/bookingController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateJWT, createBooking);
router.get('/my', authenticateJWT, getUserBookings);
router.get('/all', authenticateJWT, authorizeRoles('Admin'), getAllBookings);
router.patch('/:id', authenticateJWT, updateBookingStatus);
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), deleteBooking);

export default router;
