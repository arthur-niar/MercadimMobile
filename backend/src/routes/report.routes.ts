import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getReportHandler,
  getReportSummaryHandler,
} from "../controllers/report.controller";

const router = Router();

router.get("/vendas", authMiddleware, getReportHandler);
router.get("/summary", authMiddleware, getReportSummaryHandler);

export default router;
