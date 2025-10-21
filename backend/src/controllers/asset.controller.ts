import { Request, Response } from 'express';
import { Asset, AssetType } from '../models/Asset';

export class AssetController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { assetType, sector } = req.query;

      const where: any = {};
      if (assetType) where.assetType = assetType;
      if (sector) where.sector = sector;

      const assets = await Asset.findAll({ where });

      res.json({ success: true, data: assets });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const asset = await Asset.findByPk(id);

      if (!asset) {
        res.status(404).json({ success: false, error: 'Asset not found' });
        return;
      }

      res.json({ success: true, data: asset });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { symbol, name, assetType, sector, currentPrice, currency, exchange, metadata } = req.body;

      const asset = await Asset.create({
        symbol,
        name,
        assetType,
        sector,
        currentPrice,
        currency: currency || 'USD',
        exchange,
        metadata
      });

      res.status(201).json({ success: true, data: asset });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const asset = await Asset.findByPk(id);

      if (!asset) {
        res.status(404).json({ success: false, error: 'Asset not found' });
        return;
      }

      await asset.update(updates);

      res.json({ success: true, data: asset });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updatePrice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { currentPrice } = req.body;

      const asset = await Asset.findByPk(id);

      if (!asset) {
        res.status(404).json({ success: false, error: 'Asset not found' });
        return;
      }

      await asset.update({ currentPrice });

      res.json({ success: true, data: asset });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const asset = await Asset.findByPk(id);

      if (!asset) {
        res.status(404).json({ success: false, error: 'Asset not found' });
        return;
      }

      await asset.destroy();

      res.json({ success: true, message: 'Asset deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
