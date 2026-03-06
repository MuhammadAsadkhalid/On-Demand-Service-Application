import { Request, Response } from 'express';
import Category from '../models/Category.js';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, icon_url } = req.body;
        const category = await Category.create({ name, description, icon_url });
        res.status(201).json(category);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, icon_url } = req.body;
        const category = await Category.findByPk(id as string);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        if (name) category.name = name;
        if (description !== undefined) category.description = description;
        if (icon_url !== undefined) category.icon_url = icon_url;

        await category.save();
        res.json(category);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id as string);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Check if any services use this category
        const Service = (await import('../models/Service.js')).default;
        const serviceCount = await Service.count({ where: { category_id: id } });

        if (serviceCount > 0) {
            return res.status(400).json({ message: 'Cannot delete category that is in use by services.' });
        }

        await category.destroy();
        res.json({ message: 'Category deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
