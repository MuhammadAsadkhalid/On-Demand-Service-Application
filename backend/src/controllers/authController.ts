import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, roleName, phone, address } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const role = await Role.findOne({ where: { name: roleName || 'User' } });
        if (!role) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password_hash,
            role_id: role.id,
            phone,
            address,
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email }, include: [Role] });

        console.log('Login attempt for email:', email);
        console.log('User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('User password_hash type:', typeof user.password_hash);
            console.log('User password_hash value present:', !!user.password_hash);
        }

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const roleName = (user as any).Role.name;
        const token = jwt.sign(
            { id: user.id, email: user.email, role: roleName, is_blocked: user.is_blocked },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: roleName, is_blocked: user.is_blocked } });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({ include: [Role] });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const changePassword = async (req: any, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password.' });
        }

        user.password_hash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password updated successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
