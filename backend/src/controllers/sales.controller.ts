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

    const { productName, quantity, unitPrice } = req.body;
    const totalPrice = quantity * unitPrice;

    const sale = await createSale({
      userId: req.user.userId,
      productName,
      quantity,
      unitPrice,
      totalPrice,
    });

    console.log('Venda criada:', sale.id);
    return res.status(201).json(sale);
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    return res.status(500).json({ message: 'Erro ao criar venda' });
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
  body('productName').notEmpty().withMessage('Nome do produto é obrigatório').trim(),
  body('quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que 0'),
  body('unitPrice').isFloat({ min: 0.01 }).withMessage('Preço unitário deve ser maior que 0'),
];
