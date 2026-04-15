import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { getProfile, updateProfile } from '../controllers/profile.controller';

const router = Router();

router.get('/', authMiddleware, getProfile);

router.put(
  '/',
  authMiddleware,
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  ],
  updateProfile
);

export default router;
