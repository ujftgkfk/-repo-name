import { Request, Response } from 'express';
import { Portfolio } from '../models/Portfolio';
import { Position } from '../models/Position';
import { Asset } from '../models/Asset';
import { Trade, TradeStatus } from '../models/Trade';
import { Op } from 'sequelize';

export class AnalyticsController {
  static async getPortfolioPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { portfolioId } = req.params;
      const { period } = req.query;

      const portfolio = await Portfolio.findByPk(portfolioId, {
        include: [
          {
            model: Position,
            as: 'positions',
            include: [{ model: Asset, as: 'asset' }]
          }
        ]
      });

      if (!portfolio) {
        res.status(404).json({ success: false, error: 'Portfolio not found' });
        return;
      }

      const positions = (portfolio as any).positions || [];

      let totalUnrealizedPnL = 0;
      let totalRealizedPnL = 0;
      let totalInvested = 0;

      for (const position of positions) {
        totalUnrealizedPnL += parseFloat(position.unrealizedPnL.toString());
        totalRealizedPnL += parseFloat(position.realizedPnL.toString());
        const invested = parseFloat(position.quantity.toString()) * parseFloat(position.averagePrice.toString());
        totalInvested += invested;
      }

      const totalValue = parseFloat(portfolio.totalValue.toString());
      const totalReturn = totalUnrealizedPnL + totalRealizedPnL;
      const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

      res.json({
        success: true,
        data: {
          totalValue,
          totalInvested,
          totalReturn,
          returnPercentage,
          unrealizedPnL: totalUnrealizedPnL,
          realizedPnL: totalRealizedPnL,
          cashBalance: parseFloat(portfolio.cashBalance.toString())
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAssetAllocation(req: Request, res: Response): Promise<void> {
    try {
      const { portfolioId } = req.params;

      const portfolio = await Portfolio.findByPk(portfolioId, {
        include: [
          {
            model: Position,
            as: 'positions',
            include: [{ model: Asset, as: 'asset' }]
          }
        ]
      });

      if (!portfolio) {
        res.status(404).json({ success: false, error: 'Portfolio not found' });
        return;
      }

      const positions = (portfolio as any).positions || [];
      const totalValue = parseFloat(portfolio.totalValue.toString());

      const allocationByAssetType: Record<string, any> = {};
      const allocationBySector: Record<string, any> = {};
      const topHoldings: any[] = [];

      for (const position of positions) {
        const asset = position.asset;
        const positionValue = parseFloat(position.currentValue.toString());
        const percentage = (positionValue / totalValue) * 100;

        // By asset type
        if (!allocationByAssetType[asset.assetType]) {
          allocationByAssetType[asset.assetType] = { value: 0, percentage: 0, count: 0 };
        }
        allocationByAssetType[asset.assetType].value += positionValue;
        allocationByAssetType[asset.assetType].percentage += percentage;
        allocationByAssetType[asset.assetType].count += 1;

        // By sector
        const sector = asset.sector || 'Other';
        if (!allocationBySector[sector]) {
          allocationBySector[sector] = { value: 0, percentage: 0, count: 0 };
        }
        allocationBySector[sector].value += positionValue;
        allocationBySector[sector].percentage += percentage;
        allocationBySector[sector].count += 1;

        // Top holdings
        topHoldings.push({
          symbol: asset.symbol,
          name: asset.name,
          assetType: asset.assetType,
          value: positionValue,
          percentage,
          quantity: parseFloat(position.quantity.toString()),
          currentPrice: parseFloat(asset.currentPrice.toString())
        });
      }

      // Sort top holdings by value
      topHoldings.sort((a, b) => b.value - a.value);

      res.json({
        success: true,
        data: {
          byAssetType: allocationByAssetType,
          bySector: allocationBySector,
          topHoldings: topHoldings.slice(0, 10)
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getTradeHistory(req: Request, res: Response): Promise<void> {
    try {
      const { portfolioId } = req.params;
      const { limit, offset } = req.query;

      const trades = await Trade.findAndCountAll({
        where: {
          portfolioId,
          status: TradeStatus.EXECUTED
        },
        include: [{ model: Asset, as: 'asset' }],
        order: [['executedAt', 'DESC']],
        limit: parseInt(limit as string) || 50,
        offset: parseInt(offset as string) || 0
      });

      res.json({
        success: true,
        data: trades.rows,
        total: trades.count
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getDashboardSummary(req: Request, res: Response): Promise<void> {
    try {
      const portfolios = await Portfolio.findAll({
        include: [
          {
            model: Position,
            as: 'positions',
            include: [{ model: Asset, as: 'asset' }]
          }
        ]
      });

      let totalAUM = 0;
      let totalPositions = 0;
      const portfolioSummaries = [];

      for (const portfolio of portfolios) {
        const positions = (portfolio as any).positions || [];
        const portfolioValue = parseFloat(portfolio.totalValue.toString());

        totalAUM += portfolioValue;
        totalPositions += positions.length;

        let totalUnrealizedPnL = 0;
        for (const position of positions) {
          totalUnrealizedPnL += parseFloat(position.unrealizedPnL.toString());
        }

        portfolioSummaries.push({
          id: portfolio.id,
          name: portfolio.name,
          totalValue: portfolioValue,
          cashBalance: parseFloat(portfolio.cashBalance.toString()),
          positionsCount: positions.length,
          unrealizedPnL: totalUnrealizedPnL
        });
      }

      // Get recent trades
      const recentTrades = await Trade.findAll({
        where: { status: TradeStatus.EXECUTED },
        include: [
          { model: Portfolio, as: 'portfolio' },
          { model: Asset, as: 'asset' }
        ],
        order: [['executedAt', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          totalAUM,
          totalPortfolios: portfolios.length,
          totalPositions,
          portfolios: portfolioSummaries,
          recentTrades
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
