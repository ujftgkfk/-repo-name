import { Request, Response } from 'express';
import { RiskEngine } from '../services/riskEngine';
import { RiskMetric } from '../models/RiskMetric';
import { Portfolio } from '../models/Portfolio';

export class RiskController {
  static async analyzePortfolio(req: Request, res: Response): Promise<void> {
    try {
      const { portfolioId } = req.params;

      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) {
        res.status(404).json({ success: false, error: 'Portfolio not found' });
        return;
      }

      const analysis = await RiskEngine.analyzePortfolioRisk(portfolioId);

      // Save risk metrics to database
      await RiskMetric.create({
        portfolioId,
        date: new Date(),
        var95: analysis.var95,
        var99: analysis.var99,
        sharpeRatio: analysis.sharpeRatio,
        volatility: analysis.volatility,
        beta: analysis.beta,
        maxDrawdown: analysis.maxDrawdown,
        exposureByAssetType: analysis.exposureByAssetType,
        exposureBySector: analysis.exposureBySector,
        concentration: analysis.concentration
      });

      res.json({ success: true, data: analysis });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async runScenarioAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { portfolioId } = req.params;

      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) {
        res.status(404).json({ success: false, error: 'Portfolio not found' });
        return;
      }

      const scenarios = await RiskEngine.runScenarioAnalysis(portfolioId);

      res.json({ success: true, data: scenarios });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getRiskHistory(req: Request, res: Response): Promise<void> {
    try {
      const { portfolioId } = req.params;
      const { days } = req.query;

      const daysAgo = parseInt(days as string) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const riskMetrics = await RiskMetric.findAll({
        where: {
          portfolioId,
        },
        order: [['date', 'DESC']],
        limit: daysAgo
      });

      res.json({ success: true, data: riskMetrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
