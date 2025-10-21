import { Router } from 'express';
import { RiskController } from '../controllers/risk.controller';

const router = Router();

router.get('/portfolio/:portfolioId/analyze', RiskController.analyzePortfolio);
router.get('/portfolio/:portfolioId/scenarios', RiskController.runScenarioAnalysis);
router.get('/portfolio/:portfolioId/history', RiskController.getRiskHistory);

export default router;
