import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { createSale, getSalesByUserId } from '../database/sales';

export const createSaleHandler = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      console.log('Usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { items } = req.body;

    const sale = await createSale({
      userId: req.user.userId,
      items,
    });

    console.log('Venda criada:', sale.id);
    return res.status(201).json(sale);
  } catch (error: any) {
    console.error('Erro ao criar venda:', error);
    return res.status(500).json({ message: error.message || 'Erro ao criar venda' });
  }
};

export const getUserSales = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      console.log('Usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const sales = await getSalesByUserId(req.user.userId);
    console.log(`${sales.length} vendas encontradas`);
    return res.json(sales);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return res.status(500).json({ message: 'Erro ao buscar vendas' });
  }
};

export const validateSale = [
  body('items').isArray({ min: 1 }).withMessage('A venda deve conter pelo menos um item'),
  body('items.*.productId').notEmpty().withMessage('O ID do produto é obrigatório'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('A quantidade deve ser maior que 0'),
];
