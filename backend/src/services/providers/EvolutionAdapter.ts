import axios from 'axios';
import crypto from 'crypto';
import { BaseProviderAdapter, GameLaunchParams, GameLaunchResponse, ProviderGame } from './BaseProviderAdapter';

/**
 * Evolution Gaming Provider Adapter
 * Documentation: https://evolution.com/
 *
 * Note: This is a mock implementation for demonstration.
 * Real integration requires:
 * - API credentials from Evolution Gaming
 * - Casino license
 * - Live casino setup
 */
export class EvolutionAdapter extends BaseProviderAdapter {
  async launchGame(params: GameLaunchParams): Promise<GameLaunchResponse> {
    const { userId, gameId, isDemo, returnUrl, language = 'en', currency = 'USD' } = params;

    if (this.config.apiEndpoint === 'mock') {
      const sessionToken = this.generateSessionToken();
      const gameUrl = this.generateMockGameUrl(gameId, sessionToken, isDemo);

      return {
        sessionToken,
        gameUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    }

    // Real Evolution Gaming API
    const sessionToken = this.generateSessionToken();

    try {
      const response = await axios.post(`${this.config.apiEndpoint}/ua/v1/gamelaunch`, {
        uuid: sessionToken,
        player: {
          id: userId.toString(),
          update: true,
          firstName: 'Player',
          lastName: userId.toString(),
          country: 'US',
          language,
          currency,
          session: {
            id: sessionToken,
            ip: '127.0.0.1',
          },
        },
        config: {
          game: {
            table: {
              id: gameId,
            },
          },
          channel: {
            wrapped: false,
          },
          urls: {
            cashier: returnUrl || '',
            lobby: returnUrl || '',
          },
        },
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return {
        sessionToken,
        gameUrl: response.data.entry,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    } catch (error) {
      console.error('Evolution launch error:', error);
      throw new Error('Failed to launch Evolution game');
    }
  }

  async getGames(): Promise<ProviderGame[]> {
    if (this.config.apiEndpoint === 'mock') {
      return this.getMockGames();
    }

    try {
      const response = await axios.get(`${this.config.apiEndpoint}/catalog`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return response.data.games.map((game: any) => ({
        gameId: game.id,
        name: game.name,
        category: 'live_casino',
        thumbnail: game.thumbnail,
        hasDemo: false, // Evolution typically doesn't have demo for live games
        rtp: game.rtp,
      }));
    } catch (error) {
      console.error('Failed to fetch Evolution games:', error);
      return [];
    }
  }

  verifyCallback(signature: string, data: any): boolean {
    const hash = crypto
      .createHmac('sha256', this.config.secretKey || '')
      .update(JSON.stringify(data))
      .digest('hex');

    return hash === signature;
  }

  async getBalance(userId: number): Promise<number> {
    const { User } = require('../../database/connection');
    const user = await User.findByPk(userId);
    return user ? parseFloat(user.balance.toString()) : 0;
  }

  async processBet(data: any): Promise<any> {
    const { User } = require('../../database/connection');
    const user = await User.findByPk(data.playerId);

    if (!user) {
      throw new Error('User not found');
    }

    const balance = parseFloat(user.balance.toString());
    if (balance < data.debit.amount) {
      throw new Error('Insufficient balance');
    }

    user.balance = balance - data.debit.amount;
    await user.save();

    return {
      balance: parseFloat(user.balance.toString()),
      transactionId: data.transaction.id,
    };
  }

  async processWin(data: any): Promise<any> {
    const { User } = require('../../database/connection');
    const user = await User.findByPk(data.playerId);

    if (!user) {
      throw new Error('User not found');
    }

    user.balance = parseFloat(user.balance.toString()) + data.credit.amount;
    await user.save();

    return {
      balance: parseFloat(user.balance.toString()),
      transactionId: data.transaction.id,
    };
  }

  private generateMockGameUrl(gameId: string, sessionToken: string, isDemo: boolean): string {
    return `https://demo.evolution.com/casino/?token=${sessionToken}&game=${gameId}`;
  }

  private getMockGames(): ProviderGame[] {
    return [
      {
        gameId: 'lightning_roulette',
        name: 'Lightning Roulette',
        category: 'live_casino',
        thumbnail: 'https://via.placeholder.com/300x200?text=Lightning+Roulette',
        hasDemo: false,
        rtp: 97.3,
      },
      {
        gameId: 'crazy_time',
        name: 'Crazy Time',
        category: 'live_casino',
        thumbnail: 'https://via.placeholder.com/300x200?text=Crazy+Time',
        hasDemo: false,
        rtp: 95.41,
      },
      {
        gameId: 'monopoly_live',
        name: 'Monopoly Live',
        category: 'live_casino',
        thumbnail: 'https://via.placeholder.com/300x200?text=Monopoly+Live',
        hasDemo: false,
        rtp: 96.23,
      },
      {
        gameId: 'dream_catcher',
        name: 'Dream Catcher',
        category: 'live_casino',
        thumbnail: 'https://via.placeholder.com/300x200?text=Dream+Catcher',
        hasDemo: false,
        rtp: 96.58,
      },
      {
        gameId: 'blackjack_1',
        name: 'Live Blackjack',
        category: 'live_casino',
        thumbnail: 'https://via.placeholder.com/300x200?text=Live+Blackjack',
        hasDemo: false,
        rtp: 99.28,
      },
    ];
  }
}
