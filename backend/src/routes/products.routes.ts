import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getProductHistory,
} from '../controllers/products.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getProducts);

router.get('/:id/history', getProductHistory);

router.get('/:id', getProduct);

router.post('/', createNewProduct);

router.put('/:id', updateExistingProduct);

router.delete('/:id', deleteExistingProduct);

export default router;
