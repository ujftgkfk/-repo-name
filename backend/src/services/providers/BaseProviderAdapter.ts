export interface ProviderConfig {
  apiEndpoint: string;
  apiKey: string;
  secretKey?: string;
  [key: string]: any;
}

export interface GameLaunchParams {
  userId: number;
  gameId: string;
  isDemo: boolean;
  returnUrl?: string;
  language?: string;
  currency?: string;
}

export interface GameLaunchResponse {
  sessionToken: string;
  gameUrl: string;
  expiresAt?: Date;
}

export interface ProviderGame {
  gameId: string;
  name: string;
  category: string;
  thumbnail?: string;
  hasDemo: boolean;
  rtp?: number;
  [key: string]: any;
}

export abstract class BaseProviderAdapter {
  protected config: ProviderConfig;
  protected providerName: string;

  constructor(config: ProviderConfig, providerName: string) {
    this.config = config;
    this.providerName = providerName;
  }

  /**
   * Launch a game and return the game URL
   */
  abstract launchGame(params: GameLaunchParams): Promise<GameLaunchResponse>;

  /**
   * Get available games from provider
   */
  abstract getGames(): Promise<ProviderGame[]>;

  /**
   * Verify callback from provider
   */
  abstract verifyCallback(signature: string, data: any): boolean;

  /**
   * Handle balance check callback
   */
  abstract getBalance(userId: number): Promise<number>;

  /**
   * Handle bet callback
   */
  abstract processBet(data: any): Promise<any>;

  /**
   * Handle win callback
   */
  abstract processWin(data: any): Promise<any>;

  /**
   * Generate session token
   */
  protected generateSessionToken(): string {
    return `${this.providerName}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
