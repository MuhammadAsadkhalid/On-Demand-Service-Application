import express from 'express';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', authenticateJWT, authorizeRoles('Admin'), createCategory);
router.put('/:id', authenticateJWT, authorizeRoles('Admin'), updateCategory);
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), deleteCategory);

export default router;
