import { Request, Response } from 'express';
import { createReport, getReport } from '../database/report';

const reportController = {
    createReport: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const { itensVendidos, numeroVendas, ticketMedio, totalVendas } = req.body;
            const report = await createReport(user.id, { itensVendidos, numeroVendas, ticketMedio, totalVendas });
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