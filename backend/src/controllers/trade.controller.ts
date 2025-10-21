import { Request, Response } from 'express';
import { Trade, TradeType, TradeStatus } from '../models/Trade';
import { Portfolio } from '../models/Portfolio';
import { Asset } from '../models/Asset';
import { Position } from '../models/Position';
import { Op } from 'sequelize';

export class TradeController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { portfolioId } = req.query;

      const where = portfolioId ? { portfolioId: portfolioId as string } : {};

      const trades = await Trade.findAll({
        where,
        include: [
          { model: Portfolio, as: 'portfolio' },
          { model: Asset, as: 'asset' }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: trades });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const trade = await Trade.findByPk(id, {
        include: [
          { model: Portfolio, as: 'portfolio' },
          { model: Asset, as: 'asset' }
        ]
      });

      if (!trade) {
        res.status(404).json({ success: false, error: 'Trade not found' });
        return;
      }

      res.json({ success: true, data: trade });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { portfolioId, assetId, tradeType, quantity, price, fees } = req.body;

      // Validate portfolio
      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) {
        res.status(404).json({ success: false, error: 'Portfolio not found' });
        return;
      }

      // Validate asset
      const asset = await Asset.findByPk(assetId);
      if (!asset) {
        res.status(404).json({ success: false, error: 'Asset not found' });
        return;
      }

      const totalAmount = quantity * price + (fees || 0);

      // Check if portfolio has enough cash for buy orders
      if (tradeType === TradeType.BUY) {
        const cashBalance = parseFloat(portfolio.cashBalance.toString());
        if (cashBalance < totalAmount) {
          res.status(400).json({ success: false, error: 'Insufficient cash balance' });
          return;
        }
      }

      // Create trade
      const trade = await Trade.create({
        portfolioId,
        assetId,
        tradeType,
        quantity,
        price,
        totalAmount,
        fees: fees || 0,
        status: TradeStatus.PENDING
      });

      res.status(201).json({ success: true, data: trade });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async execute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const trade = await Trade.findByPk(id, {
        include: [{ model: Portfolio, as: 'portfolio' }, { model: Asset, as: 'asset' }]
      });

      if (!trade) {
        res.status(404).json({ success: false, error: 'Trade not found' });
        return;
      }

      if (trade.status !== TradeStatus.PENDING) {
        res.status(400).json({ success: false, error: 'Trade is not in pending status' });
        return;
      }

      const portfolio = (trade as any).portfolio;
      const asset = (trade as any).asset;
      const quantity = parseFloat(trade.quantity.toString());
      const price = parseFloat(trade.price.toString());
      const totalAmount = parseFloat(trade.totalAmount.toString());

      // Update portfolio cash balance
      const cashBalance = parseFloat(portfolio.cashBalance.toString());
      const newCashBalance = trade.tradeType === TradeType.BUY
        ? cashBalance - totalAmount
        : cashBalance + totalAmount;

      await portfolio.update({ cashBalance: newCashBalance });

      // Update or create position
      let position = await Position.findOne({
        where: { portfolioId: trade.portfolioId, assetId: trade.assetId }
      });

      if (position) {
        const currentQuantity = parseFloat(position.quantity.toString());
        const averagePrice = parseFloat(position.averagePrice.toString());

        if (trade.tradeType === TradeType.BUY) {
          const newQuantity = currentQuantity + quantity;
          const newAveragePrice = ((currentQuantity * averagePrice) + (quantity * price)) / newQuantity;

          await position.update({
            quantity: newQuantity,
            averagePrice: newAveragePrice
          });
        } else {
          // SELL
          const newQuantity = currentQuantity - quantity;
          const realizedPnL = (price - averagePrice) * quantity;

          if (newQuantity <= 0) {
            await position.destroy();
          } else {
            await position.update({
              quantity: newQuantity,
              realizedPnL: parseFloat(position.realizedPnL.toString()) + realizedPnL
            });
          }
        }
      } else if (trade.tradeType === TradeType.BUY) {
        // Create new position for buy orders
        position = await Position.create({
          portfolioId: trade.portfolioId,
          assetId: trade.assetId,
          quantity,
          averagePrice: price,
          currentValue: quantity * parseFloat(asset.currentPrice.toString()),
          unrealizedPnL: 0,
          realizedPnL: 0
        });
      }

      // Mark trade as executed
      await trade.update({
        status: TradeStatus.EXECUTED,
        executedAt: new Date()
      });

      res.json({ success: true, data: trade, message: 'Trade executed successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const trade = await Trade.findByPk(id);

      if (!trade) {
        res.status(404).json({ success: false, error: 'Trade not found' });
        return;
      }

      if (trade.status !== TradeStatus.PENDING) {
        res.status(400).json({ success: false, error: 'Only pending trades can be cancelled' });
        return;
      }

      await trade.update({ status: TradeStatus.CANCELLED });

      res.json({ success: true, data: trade, message: 'Trade cancelled successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
