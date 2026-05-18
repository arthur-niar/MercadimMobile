import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getVendasByUserId, getReportSummaryByUserId } from '../database/report';

export const getReportHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const userId = req.user.userId;
    const vendas = await getVendasByUserId(userId);
    return res.json({ venda: vendas });
  } catch (error: any) {
    console.error('Erro ao buscar relatório:', error);
    return res.status(500).json({ message: error.message || 'Erro ao buscar relatório' });
  }
};

export const getReportSummaryHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const userId = req.user.userId;
    const summary = await getReportSummaryByUserId(userId);
    return res.json(summary);
  } catch (error: any) {
    console.error('Erro ao buscar resumo do relatório:', error);
    return res.status(500).json({ message: error.message || 'Erro ao buscar resumo do relatório' });
  }
};
