import { Router } from 'express';
import { applyForTask, getApplicationsForTask, updateApplicationStatus } from '../controllers/applicationController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/apply/:taskId', authenticate, authorizeRoles('volunteer'), applyForTask);
router.get('/task/:taskId', authenticate, authorizeRoles('organization'), getApplicationsForTask);
router.put('/:applicationId', authenticate, authorizeRoles('organization'), updateApplicationStatus);

export default router; 