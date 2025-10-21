import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', AnalyticsController.getDashboardSummary);
router.get('/portfolio/:portfolioId/performance', AnalyticsController.getPortfolioPerformance);
router.get('/portfolio/:portfolioId/allocation', AnalyticsController.getAssetAllocation);
router.get('/portfolio/:portfolioId/trades', AnalyticsController.getTradeHistory);

export default router;
