import crypto from 'crypto';

export class ProvablyFairService {
  // Generate a cryptographically secure random seed
  static generateServerSeed(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate hash of server seed for client verification
  static hashServerSeed(serverSeed: string): string {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
  }

  // Generate a random number between 0 and 1 using seeds
  static generateRandomNumber(serverSeed: string, clientSeed: string, nonce: number): number {
    const combined = `${serverSeed}-${clientSeed}-${nonce}`;
    const hash = crypto.createHmac('sha256', serverSeed).update(combined).digest('hex');

    // Take first 8 characters and convert to number between 0 and 1
    const hex = hash.substring(0, 8);
    const num = parseInt(hex, 16);
    return num / 0xffffffff;
  }

  // Generate dice result (0-100)
  static generateDiceResult(serverSeed: string, clientSeed: string, nonce: number): number {
    const random = this.generateRandomNumber(serverSeed, clientSeed, nonce);
    return Math.floor(random * 10000) / 100;
  }

  // Generate slot reels result
  static generateSlotResult(serverSeed: string, clientSeed: string, nonce: number): number[][] {
    const symbols = [0, 1, 2, 3, 4, 5, 6, 7]; // 8 different symbols
    const reels: number[][] = [];

    for (let reel = 0; reel < 5; reel++) {
      const reelSymbols: number[] = [];
      for (let row = 0; row < 3; row++) {
        const random = this.generateRandomNumber(serverSeed, clientSeed, nonce + reel * 3 + row);
        reelSymbols.push(symbols[Math.floor(random * symbols.length)]);
      }
      reels.push(reelSymbols);
    }

    return reels;
  }

  // Generate roulette result (0-36)
  static generateRouletteResult(serverSeed: string, clientSeed: string, nonce: number): number {
    const random = this.generateRandomNumber(serverSeed, clientSeed, nonce);
    return Math.floor(random * 37);
  }

  // Generate blackjack card (0-51, representing deck)
  static generateCard(serverSeed: string, clientSeed: string, nonce: number): number {
    const random = this.generateRandomNumber(serverSeed, clientSeed, nonce);
    return Math.floor(random * 52);
  }

  // Verify a bet result
  static verifyResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    game: string,
    result: any
  ): boolean {
    switch (game) {
      case 'dice':
        return this.generateDiceResult(serverSeed, clientSeed, nonce) === result;
      case 'roulette':
        return this.generateRouletteResult(serverSeed, clientSeed, nonce) === result;
      default:
        return false;
    }
  }
}
