import axios from 'axios';
import crypto from 'crypto';
import { BaseProviderAdapter, GameLaunchParams, GameLaunchResponse, ProviderGame } from './BaseProviderAdapter';

/**
 * Pragmatic Play Provider Adapter
 * Documentation: https://pragmaticplay.com/en/
 *
 * Note: This is a mock implementation for demonstration.
 * Real integration requires:
 * - API credentials from Pragmatic Play
 * - Whitelisted IP addresses
 * - Valid casino license
 */
export class PragmaticPlayAdapter extends BaseProviderAdapter {
  async launchGame(params: GameLaunchParams): Promise<GameLaunchResponse> {
    const { userId, gameId, isDemo, returnUrl, language = 'en', currency = 'USD' } = params;

    // In real implementation, call Pragmatic Play API
    // For mock: generate demo URL
    if (this.config.apiEndpoint === 'mock') {
      const sessionToken = this.generateSessionToken();
      const gameUrl = this.generateMockGameUrl(gameId, sessionToken, isDemo);

      return {
        sessionToken,
        gameUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
    }

    // Real Pragmatic Play API call would look like:
    const sessionToken = this.generateSessionToken();
    const hash = this.generateHash(sessionToken, userId.toString());

    try {
      const response = await axios.post(`${this.config.apiEndpoint}/game/launch`, {
        secureLogin: this.config.apiKey,
        stylename: 'stake',
        symbol: gameId,
        technology: 'H5',
        platform: 'WEB',
        cashierUrl: returnUrl || '',
        lobbyUrl: returnUrl || '',
        token: sessionToken,
        playerId: userId.toString(),
        language,
        currency,
        mode: isDemo ? 'demo' : 'real',
        hash,
      });

      return {
        sessionToken,
        gameUrl: response.data.gameURL,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    } catch (error) {
      console.error('Pragmatic Play launch error:', error);
      throw new Error('Failed to launch Pragmatic Play game');
    }
  }

  async getGames(): Promise<ProviderGame[]> {
    if (this.config.apiEndpoint === 'mock') {
      return this.getMockGames();
    }

    // Real API call to get games catalog
    try {
      const response = await axios.get(`${this.config.apiEndpoint}/game/catalog`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return response.data.games.map((game: any) => ({
        gameId: game.gameID,
        name: game.gameName,
        category: this.mapCategory(game.category),
        thumbnail: game.thumbnail,
        hasDemo: game.hasDemo,
        rtp: game.rtp,
      }));
    } catch (error) {
      console.error('Failed to fetch Pragmatic Play games:', error);
      return [];
    }
  }

  verifyCallback(signature: string, data: any): boolean {
    const hash = crypto
      .createHash('md5')
      .update(`${data.playerId}${data.amount}${this.config.secretKey}`)
      .digest('hex');

    return hash === signature;
  }

  async getBalance(userId: number): Promise<number> {
    // Return user balance from database
    const { User } = require('../../database/connection');
    const user = await User.findByPk(userId);
    return user ? parseFloat(user.balance.toString()) : 0;
  }

  async processBet(data: any): Promise<any> {
    // Process bet transaction
    const { User } = require('../../database/connection');
    const user = await User.findByPk(data.playerId);

    if (!user) {
      throw new Error('User not found');
    }

    const balance = parseFloat(user.balance.toString());
    if (balance < data.amount) {
      throw new Error('Insufficient balance');
    }

    user.balance = balance - data.amount;
    await user.save();

    return {
      balance: parseFloat(user.balance.toString()),
      transactionId: data.transactionId,
    };
  }

  async processWin(data: any): Promise<any> {
    // Process win transaction
    const { User } = require('../../database/connection');
    const user = await User.findByPk(data.playerId);

    if (!user) {
      throw new Error('User not found');
    }

    user.balance = parseFloat(user.balance.toString()) + data.amount;
    await user.save();

    return {
      balance: parseFloat(user.balance.toString()),
      transactionId: data.transactionId,
    };
  }

  private generateHash(token: string, playerId: string): string {
    return crypto
      .createHash('md5')
      .update(`${token}${playerId}${this.config.secretKey}`)
      .digest('hex');
  }

  private generateMockGameUrl(gameId: string, sessionToken: string, isDemo: boolean): string {
    return `https://demo-game.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${gameId}&websiteUrl=stake&technology=H5&platform=WEB&mode=${isDemo ? 'demo' : 'real'}&token=${sessionToken}`;
  }

  private mapCategory(category: string): string {
    const mapping: { [key: string]: string } = {
      'slot': 'slots',
      'live': 'live_casino',
      'table': 'table_games',
    };
    return mapping[category.toLowerCase()] || 'slots';
  }

  private getMockGames(): ProviderGame[] {
    return [
      {
        gameId: 'vs20goldrush',
        name: 'Gold Rush',
        category: 'slots',
        thumbnail: 'https://via.placeholder.com/300x200?text=Gold+Rush',
        hasDemo: true,
        rtp: 96.5,
      },
      {
        gameId: 'vs20doghouse',
        name: 'The Dog House',
        category: 'slots',
        thumbnail: 'https://via.placeholder.com/300x200?text=Dog+House',
        hasDemo: true,
        rtp: 96.51,
      },
      {
        gameId: 'vs20fruitsw',
        name: 'Sweet Bonanza',
        category: 'slots',
        thumbnail: 'https://via.placeholder.com/300x200?text=Sweet+Bonanza',
        hasDemo: true,
        rtp: 96.48,
      },
      {
        gameId: 'vs10wildwest',
        name: 'Wild West Gold',
        category: 'slots',
        thumbnail: 'https://via.placeholder.com/300x200?text=Wild+West+Gold',
        hasDemo: true,
        rtp: 96.51,
      },
      {
        gameId: 'vs25wolfgold',
        name: 'Wolf Gold',
        category: 'slots',
        thumbnail: 'https://via.placeholder.com/300x200?text=Wolf+Gold',
        hasDemo: true,
        rtp: 96.0,
      },
    ];
  }
}
