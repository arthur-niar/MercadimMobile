import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as salesController from '../controllers/sales.controller';

const router = Router();

router.post('/', authMiddleware, salesController.validateSale, salesController.createSaleHandler);
router.get('/', authMiddleware, salesController.getUserSales);

export default router;
