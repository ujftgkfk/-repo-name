import { Request, Response } from 'express';
import { providerService } from '../services/ProviderService';
import { GameCategory } from '../models/Game';

export const getAllProviders = async (req: Request, res: Response) => {
  try {
    const providers = await providerService.getAllProviders();
    res.json({ providers });
  } catch (error) {
    console.error('Error getting providers:', error);
    res.status(500).json({ error: 'Failed to get providers' });
  }
};

export const getProviderGames = async (req: Request, res: Response) => {
  try {
    const { providerSlug } = req.params;
    const games = await providerService.getProviderGames(providerSlug);
    res.json({ games });
  } catch (error: any) {
    console.error('Error getting provider games:', error);
    res.status(500).json({ error: error.message || 'Failed to get provider games' });
  }
};

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const { category, search, limit } = req.query;

    const filters: any = {};
    if (category) filters.category = category as GameCategory;
    if (search) filters.search = search as string;
    if (limit) filters.limit = parseInt(limit as string);

    const games = await providerService.getAllGames(filters);
    res.json({ games });
  } catch (error) {
    console.error('Error getting games:', error);
    res.status(500).json({ error: 'Failed to get games' });
  }
};

export const getPopularGames = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const games = await providerService.getPopularGames(limit);
    res.json({ games });
  } catch (error) {
    console.error('Error getting popular games:', error);
    res.status(500).json({ error: 'Failed to get popular games' });
  }
};

export const getGamesByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const games = await providerService.getGamesByCategory(category as GameCategory, limit);
    res.json({ games });
  } catch (error) {
    console.error('Error getting games by category:', error);
    res.status(500).json({ error: 'Failed to get games by category' });
  }
};

export const launchGame = async (req: Request, res: Response) => {
  try {
    const { userId, gameId, isDemo = false } = req.body;

    if (!userId || !gameId) {
      return res.status(400).json({ error: 'userId and gameId are required' });
    }

    const result = await providerService.launchGame(
      parseInt(userId),
      parseInt(gameId),
      Boolean(isDemo)
    );

    res.json(result);
  } catch (error: any) {
    console.error('Error launching game:', error);
    res.status(500).json({ error: error.message || 'Failed to launch game' });
  }
};

export const syncProviderGames = async (req: Request, res: Response) => {
  try {
    const { providerSlug } = req.params;
    const result = await providerService.syncProviderGames(providerSlug);
    res.json({ message: 'Games synced successfully', ...result });
  } catch (error: any) {
    console.error('Error syncing provider games:', error);
    res.status(500).json({ error: error.message || 'Failed to sync provider games' });
  }
};
