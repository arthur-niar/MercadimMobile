import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as notificationsController from '../controllers/notifications.controller';

const router = Router();

router.get('/', authMiddleware, notificationsController.getNotifications);
router.put('/:id/read', authMiddleware, notificationsController.markAsRead);
router.delete('/', authMiddleware, notificationsController.clearNotifications);

export default router;
