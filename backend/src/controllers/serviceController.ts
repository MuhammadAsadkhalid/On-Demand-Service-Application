import { Request, Response } from 'express';
import Service from '../models/Service.js';
import Category from '../models/Category.js';

export const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await Service.findAll({ include: [Category] });
        res.json(services);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createService = async (req: Request, res: Response) => {
    try {
        const { categoryName, name, description, price } = req.body;

        if (!categoryName || !name || !price) {
            return res.status(400).json({ message: 'Missing required fields: categoryName, name, and price are required.' });
        }

        console.log('Creating service:', { categoryName, name, price });

        // Find or create the category by name
        const [category, created] = await Category.findOrCreate({
            where: { name: categoryName.trim() }
        });

        if (created) {
            console.log('Created new category:', categoryName);
        }

        const service = await Service.create({
            category_id: category.id,
            name: name.trim(),
            description: description?.trim(),
            price: parseFloat(price)
        });

        console.log('Service created successfully:', service.id);
        res.status(201).json(service);
    } catch (error: any) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: error.message || 'An error occurred while creating the service.' });
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { categoryName, name, description, price } = req.body;

        const service = await Service.findByPk(id as string);
        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        if (categoryName) {
            const [category] = await Category.findOrCreate({
                where: { name: categoryName.trim() }
            });
            service.category_id = category.id;
        }

        if (name) service.name = name.trim();
        if (description !== undefined) service.description = description.trim();
        if (price !== undefined) service.price = parseFloat(price);
        if (req.body.is_active !== undefined) service.is_active = req.body.is_active;

        await service.save();
        res.json(service);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id as string);

        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        await service.destroy();
        res.json({ message: 'Service deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
