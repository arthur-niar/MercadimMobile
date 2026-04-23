import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth';
import { getProfile, updateProfile, uploadProfilePhoto, removeProfilePhoto } from '../controllers/profile.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

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

router.post('/photo', authMiddleware, upload.single('photo'), uploadProfilePhoto);

router.delete('/photo', authMiddleware, removeProfilePhoto);

export default router;
