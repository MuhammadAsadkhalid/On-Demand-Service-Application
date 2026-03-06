import express from 'express';
import { getAllServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllServices);
router.post('/', authenticateJWT, authorizeRoles('Admin'), createService);
router.put('/:id', authenticateJWT, authorizeRoles('Admin'), updateService);
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), deleteService);

export default router;
