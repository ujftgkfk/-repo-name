import { Provider } from '../models/Provider';
import { Game, GameCategory } from '../models/Game';
import { GameSession } from '../models/GameSession';
import { BaseProviderAdapter } from './providers/BaseProviderAdapter';
import { PragmaticPlayAdapter } from './providers/PragmaticPlayAdapter';
import { EvolutionAdapter } from './providers/EvolutionAdapter';
import { NetEntAdapter } from './providers/NetEntAdapter';

export class ProviderService {
  private adapters: Map<string, BaseProviderAdapter> = new Map();

  constructor() {
    this.initializeAdapters();
  }

  private async initializeAdapters() {
    const providers = await Provider.findAll({ where: { isActive: true } });

    for (const provider of providers) {
      const adapter = this.createAdapter(provider);
      if (adapter) {
        this.adapters.set(provider.slug, adapter);
      }
    }
  }

  private createAdapter(provider: any): BaseProviderAdapter | null {
    const config = {
      apiEndpoint: provider.isMock ? 'mock' : provider.apiEndpoint,
      apiKey: provider.apiKey || '',
      secretKey: provider.config?.secretKey || '',
      ...provider.config,
    };

    switch (provider.slug) {
      case 'pragmatic-play':
        return new PragmaticPlayAdapter(config, provider.name);
      case 'evolution':
        return new EvolutionAdapter(config, provider.name);
      case 'netent':
        return new NetEntAdapter(config, provider.name);
      default:
        return null;
    }
  }

  async getAllProviders() {
    return await Provider.findAll({ where: { isActive: true } });
  }

  async getProviderGames(providerSlug: string) {
    const provider = await Provider.findOne({ where: { slug: providerSlug, isActive: true } });
    if (!provider) {
      throw new Error('Provider not found');
    }

    return await Game.findAll({
      where: { providerId: provider.id, isActive: true },
      order: [['popularity', 'DESC']],
    });
  }

  async getAllGames(filters?: { category?: GameCategory; search?: string; limit?: number }) {
    const where: any = { isActive: true };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.name = { [require('sequelize').Op.iLike]: `%${filters.search}%` };
    }

    return await Game.findAll({
      where,
      include: [{ model: Provider, as: 'provider' }],
      order: [['popularity', 'DESC']],
      limit: filters?.limit || 100,
    });
  }

  async launchGame(userId: number, gameId: number, isDemo: boolean = false) {
    const game = await Game.findByPk(gameId, {
      include: [{ model: Provider, as: 'provider' }],
    });

    if (!game) {
      throw new Error('Game not found');
    }

    const provider = game.get('provider') as any;
    if (!provider || !provider.isActive) {
      throw new Error('Provider not active');
    }

    if (isDemo && !game.hasDemo) {
      throw new Error('Demo mode not available for this game');
    }

    const adapter = this.adapters.get(provider.slug);
    if (!adapter) {
      throw new Error('Provider adapter not found');
    }

    const launchData = await adapter.launchGame({
      userId,
      gameId: game.gameId,
      isDemo,
      returnUrl: process.env.CASINO_URL || 'http://localhost:3000',
      language: 'en',
      currency: 'USD',
    });

    // Create session
    const session = await GameSession.create({
      userId,
      gameId: game.id,
      providerId: provider.id,
      sessionToken: launchData.sessionToken,
      gameUrl: launchData.gameUrl,
      isDemo,
      isActive: true,
      expiresAt: launchData.expiresAt,
    });

    // Update game popularity
    await game.update({ popularity: game.popularity + 1 });

    return {
      sessionId: session.id,
      gameUrl: launchData.gameUrl,
      sessionToken: launchData.sessionToken,
    };
  }

  async syncProviderGames(providerSlug: string) {
    const provider = await Provider.findOne({ where: { slug: providerSlug } });
    if (!provider) {
      throw new Error('Provider not found');
    }

    const adapter = this.adapters.get(providerSlug);
    if (!adapter) {
      throw new Error('Provider adapter not found');
    }

    const providerGames = await adapter.getGames();

    for (const gameData of providerGames) {
      await Game.findOrCreate({
        where: {
          providerId: provider.id,
          gameId: gameData.gameId,
        },
        defaults: {
          providerId: provider.id,
          gameId: gameData.gameId,
          name: gameData.name,
          slug: `${providerSlug}-${gameData.gameId}`,
          category: gameData.category as GameCategory,
          thumbnail: gameData.thumbnail,
          hasDemo: gameData.hasDemo,
          rtp: gameData.rtp,
          isActive: true,
          popularity: 0,
        },
      });
    }

    return { synced: providerGames.length };
  }

  async getPopularGames(limit: number = 20) {
    return await Game.findAll({
      where: { isActive: true },
      include: [{ model: Provider, as: 'provider' }],
      order: [['popularity', 'DESC']],
      limit,
    });
  }

  async getGamesByCategory(category: GameCategory, limit: number = 50) {
    return await Game.findAll({
      where: { category, isActive: true },
      include: [{ model: Provider, as: 'provider' }],
      order: [['popularity', 'DESC']],
      limit,
    });
  }
}

export const providerService = new ProviderService();
