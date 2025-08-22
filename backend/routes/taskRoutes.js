import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);

router.post('/', authenticate, authorizeRoles('organization'), createTask);
router.put('/:id', authenticate, authorizeRoles('organization'), updateTask);
router.delete('/:id', authenticate, authorizeRoles('organization'), deleteTask);

export default router; 