import { Request, Response } from 'express';
import { createReport, getReport } from '../database/report';

const reportController = {
    createReport: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const { nomeProduto, lucroTotal, vendasTotais, vendasSemanais, aumentoEstoque } = req.body;
            const report = await createReport(user.id, { nomeProduto, lucroTotal, vendasTotais, vendasSemanais, aumentoEstoque });
            res.status(201).json(report);
        } catch (error) {
            res.status(500).json({ error: 'Error creating report' });
        }
    },
    getReport: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const report = await getReport(user.id);
            res.json(report);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching report' });
        }
    }
};