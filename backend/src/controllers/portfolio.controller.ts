import { Request, Response } from 'express';
import { Portfolio } from '../models/Portfolio';
import { Position } from '../models/Position';
import { Asset } from '../models/Asset';

export class PortfolioController {
  static async getAll(req: Request, res: Response): Promise<void> {
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

      res.json({ success: true, data: portfolios });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const portfolio = await Portfolio.findByPk(id, {
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

      res.json({ success: true, data: portfolio });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, currency, cashBalance } = req.body;

      const portfolio = await Portfolio.create({
        name,
        description,
        currency: currency || 'USD',
        cashBalance: cashBalance || 0,
        totalValue: cashBalance || 0
      });

      res.status(201).json({ success: true, data: portfolio });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, cashBalance } = req.body;

      const portfolio = await Portfolio.findByPk(id);

      if (!portfolio) {
        res.status(404).json({ success: false, error: 'Portfolio not found' });
        return;
      }

      await portfolio.update({ name, description, cashBalance });

      res.json({ success: true, data: portfolio });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const portfolio = await Portfolio.findByPk(id);

      if (!portfolio) {
        res.status(404).json({ success: false, error: 'Portfolio not found' });
        return;
      }

      await portfolio.destroy();

      res.json({ success: true, message: 'Portfolio deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getPositions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const positions = await Position.findAll({
        where: { portfolioId: id },
        include: [{ model: Asset, as: 'asset' }]
      });

      res.json({ success: true, data: positions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updatePositionValues(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const positions = await Position.findAll({
        where: { portfolioId: id },
        include: [{ model: Asset, as: 'asset' }]
      });

      let totalValue = 0;

      for (const position of positions) {
        const asset = (position as any).asset;
        const currentPrice = parseFloat(asset.currentPrice.toString());
        const quantity = parseFloat(position.quantity.toString());
        const averagePrice = parseFloat(position.averagePrice.toString());

        const currentValue = currentPrice * quantity;
        const unrealizedPnL = (currentPrice - averagePrice) * quantity;

        await position.update({ currentValue, unrealizedPnL });
        totalValue += currentValue;
      }

      const portfolio = await Portfolio.findByPk(id);
      if (portfolio) {
        const cashBalance = parseFloat(portfolio.cashBalance.toString());
        await portfolio.update({ totalValue: totalValue + cashBalance });
      }

      res.json({ success: true, message: 'Position values updated', totalValue });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
