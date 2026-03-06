import { Response } from 'express';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { AuthRequest } from '../middleware/auth.js';
import { Op } from 'sequelize';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Role,
                where: { name: { [Op.ne]: 'Admin' } }
            }],
            attributes: { exclude: ['password_hash'] }
        });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const blockUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id as string);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.is_blocked = true;
        await user.save();
        res.json({ message: 'User blocked successfully', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const unblockUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id as string);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.is_blocked = false;
        await user.save();
        res.json({ message: 'User unblocked successfully', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id as string);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.json({ message: 'User and all associated data deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] },
            include: [Role]
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, phone, address, profile_picture } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Basic validation
        if (email && email !== user.email) {
            const existing = await User.findOne({ where: { email } });
            if (existing) return res.status(400).json({ message: 'Email already in use' });
            user.email = email;
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (profile_picture !== undefined) user.profile_picture = profile_picture;

        await user.save();

        // Return user without password
        const updatedUser = await User.findByPk(user.id, {
            attributes: { exclude: ['password_hash'] }
        });

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
