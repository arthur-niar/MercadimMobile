import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as homeController from '../controllers/home.controller';

const router = Router();

router.get('/summary', authMiddleware, homeController.getHomeSummary);

export default router;
