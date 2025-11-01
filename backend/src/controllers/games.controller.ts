import { Request, Response } from 'express';
import { User } from '../models/User';
import { Bet } from '../models/Bet';
import { ProvablyFairService } from '../services/provablyFair';
import { Op } from 'sequelize';

// DICE GAME
export const playDice = async (req: Request, res: Response) => {
  try {
    const { userId, betAmount, target, isOver, clientSeed } = req.body;

    if (!userId || !betAmount || target === undefined || isOver === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const balance = parseFloat(user.balance.toString());
    if (balance < betAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Generate provably fair result
    const serverSeed = ProvablyFairService.generateServerSeed();
    const nonce = await Bet.count({ where: { userId } }) + 1;
    const result = ProvablyFairService.generateDiceResult(
      serverSeed,
      clientSeed || 'default-client-seed',
      nonce
    );

    // Calculate win
    const isWin = isOver ? result > target : result < target;
    const houseEdge = 0.01; // 1% house edge
    const winChance = isOver ? (100 - target) : target;
    const multiplier = isWin ? (100 / winChance) * (1 - houseEdge) : 0;
    const payout = isWin ? betAmount * multiplier : 0;
    const profit = payout - betAmount;

    // Update balance
    user.balance = balance - betAmount + payout;
    await user.save();

    // Create bet record
    const bet = await Bet.create({
      userId,
      game: 'dice',
      betAmount,
      multiplier,
      payout,
      profit,
      isWin,
      gameData: { result, target, isOver },
      serverSeed: ProvablyFairService.hashServerSeed(serverSeed),
      clientSeed: clientSeed || 'default-client-seed',
      nonce,
    });

    res.json({
      betId: bet.id,
      result,
      isWin,
      multiplier: parseFloat(multiplier.toFixed(4)),
      payout: parseFloat(payout.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      newBalance: parseFloat(user.balance.toString()),
      serverSeedHash: ProvablyFairService.hashServerSeed(serverSeed),
      nonce,
    });
  } catch (error) {
    console.error('Error playing dice:', error);
    res.status(500).json({ error: 'Failed to play dice' });
  }
};

// SLOTS GAME
export const playSlots = async (req: Request, res: Response) => {
  try {
    const { userId, betAmount, clientSeed } = req.body;

    if (!userId || !betAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const balance = parseFloat(user.balance.toString());
    if (balance < betAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Generate provably fair result
    const serverSeed = ProvablyFairService.generateServerSeed();
    const nonce = await Bet.count({ where: { userId } }) + 1;
    const reels = ProvablyFairService.generateSlotResult(
      serverSeed,
      clientSeed || 'default-client-seed',
      nonce
    );

    // Calculate win (simple payline - middle row)
    const middleRow = reels.map(reel => reel[1]);
    let multiplier = 0;
    let isWin = false;

    // Check for matches
    if (middleRow.every(symbol => symbol === middleRow[0])) {
      // All 5 match
      multiplier = 10;
      isWin = true;
    } else if (middleRow.slice(0, 4).every(symbol => symbol === middleRow[0])) {
      // 4 match
      multiplier = 5;
      isWin = true;
    } else if (middleRow.slice(0, 3).every(symbol => symbol === middleRow[0])) {
      // 3 match
      multiplier = 2;
      isWin = true;
    }

    const payout = isWin ? betAmount * multiplier : 0;
    const profit = payout - betAmount;

    // Update balance
    user.balance = balance - betAmount + payout;
    await user.save();

    // Create bet record
    const bet = await Bet.create({
      userId,
      game: 'slots',
      betAmount,
      multiplier,
      payout,
      profit,
      isWin,
      gameData: { reels },
      serverSeed: ProvablyFairService.hashServerSeed(serverSeed),
      clientSeed: clientSeed || 'default-client-seed',
      nonce,
    });

    res.json({
      betId: bet.id,
      reels,
      isWin,
      multiplier,
      payout: parseFloat(payout.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      newBalance: parseFloat(user.balance.toString()),
      serverSeedHash: ProvablyFairService.hashServerSeed(serverSeed),
      nonce,
    });
  } catch (error) {
    console.error('Error playing slots:', error);
    res.status(500).json({ error: 'Failed to play slots' });
  }
};

// ROULETTE GAME
export const playRoulette = async (req: Request, res: Response) => {
  try {
    const { userId, betAmount, betType, betValue, clientSeed } = req.body;

    if (!userId || !betAmount || !betType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const balance = parseFloat(user.balance.toString());
    if (balance < betAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Generate provably fair result
    const serverSeed = ProvablyFairService.generateServerSeed();
    const nonce = await Bet.count({ where: { userId } }) + 1;
    const result = ProvablyFairService.generateRouletteResult(
      serverSeed,
      clientSeed || 'default-client-seed',
      nonce
    );

    // Calculate win based on bet type
    let isWin = false;
    let multiplier = 0;

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

    switch (betType) {
      case 'straight':
        isWin = result === betValue;
        multiplier = isWin ? 35 : 0;
        break;
      case 'red':
        isWin = redNumbers.includes(result);
        multiplier = isWin ? 1 : 0;
        break;
      case 'black':
        isWin = blackNumbers.includes(result);
        multiplier = isWin ? 1 : 0;
        break;
      case 'even':
        isWin = result !== 0 && result % 2 === 0;
        multiplier = isWin ? 1 : 0;
        break;
      case 'odd':
        isWin = result !== 0 && result % 2 === 1;
        multiplier = isWin ? 1 : 0;
        break;
      case 'low':
        isWin = result >= 1 && result <= 18;
        multiplier = isWin ? 1 : 0;
        break;
      case 'high':
        isWin = result >= 19 && result <= 36;
        multiplier = isWin ? 1 : 0;
        break;
    }

    const payout = isWin ? betAmount * (multiplier + 1) : 0;
    const profit = payout - betAmount;

    // Update balance
    user.balance = balance - betAmount + payout;
    await user.save();

    // Create bet record
    const bet = await Bet.create({
      userId,
      game: 'roulette',
      betAmount,
      multiplier,
      payout,
      profit,
      isWin,
      gameData: { result, betType, betValue },
      serverSeed: ProvablyFairService.hashServerSeed(serverSeed),
      clientSeed: clientSeed || 'default-client-seed',
      nonce,
    });

    res.json({
      betId: bet.id,
      result,
      isWin,
      multiplier,
      payout: parseFloat(payout.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      newBalance: parseFloat(user.balance.toString()),
      serverSeedHash: ProvablyFairService.hashServerSeed(serverSeed),
      nonce,
    });
  } catch (error) {
    console.error('Error playing roulette:', error);
    res.status(500).json({ error: 'Failed to play roulette' });
  }
};

// BLACKJACK GAME
export const playBlackjack = async (req: Request, res: Response) => {
  try {
    const { userId, betAmount, action, gameState, clientSeed } = req.body;

    if (!userId || !betAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const balance = parseFloat(user.balance.toString());
    if (balance < betAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const serverSeed = ProvablyFairService.generateServerSeed();
    const nonce = await Bet.count({ where: { userId } }) + 1;

    // Helper function to get card value
    const getCardValue = (card: number): number => {
      const value = (card % 13) + 1;
      if (value > 10) return 10;
      if (value === 1) return 11; // Ace
      return value;
    };

    // Helper function to calculate hand value
    const calculateHand = (cards: number[]): number => {
      let value = cards.reduce((sum, card) => sum + getCardValue(card), 0);
      let aces = cards.filter(card => (card % 13) + 1 === 1).length;

      while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
      }
      return value;
    };

    // Initial deal or continue game
    let playerCards = gameState?.playerCards || [];
    let dealerCards = gameState?.dealerCards || [];

    if (action === 'deal') {
      // Deal initial cards
      playerCards = [
        ProvablyFairService.generateCard(serverSeed, clientSeed || 'default', nonce),
        ProvablyFairService.generateCard(serverSeed, clientSeed || 'default', nonce + 1),
      ];
      dealerCards = [
        ProvablyFairService.generateCard(serverSeed, clientSeed || 'default', nonce + 2),
        ProvablyFairService.generateCard(serverSeed, clientSeed || 'default', nonce + 3),
      ];

      return res.json({
        action: 'deal',
        playerCards,
        dealerCards: [dealerCards[0]], // Only show first dealer card
        playerValue: calculateHand(playerCards),
        gameState: { playerCards, dealerCards, nonce },
        serverSeedHash: ProvablyFairService.hashServerSeed(serverSeed),
      });
    }

    if (action === 'hit') {
      const newCard = ProvablyFairService.generateCard(
        serverSeed,
        clientSeed || 'default',
        nonce + playerCards.length + dealerCards.length
      );
      playerCards.push(newCard);

      const playerValue = calculateHand(playerCards);

      if (playerValue > 21) {
        // Bust
        user.balance = balance - betAmount;
        await user.save();

        await Bet.create({
          userId,
          game: 'blackjack',
          betAmount,
          multiplier: 0,
          payout: 0,
          profit: -betAmount,
          isWin: false,
          gameData: { playerCards, dealerCards, playerValue, dealerValue: calculateHand(dealerCards), result: 'bust' },
          serverSeed: ProvablyFairService.hashServerSeed(serverSeed),
          clientSeed: clientSeed || 'default-client-seed',
          nonce,
        });

        return res.json({
          action: 'bust',
          playerCards,
          dealerCards,
          playerValue,
          dealerValue: calculateHand(dealerCards),
          isWin: false,
          payout: 0,
          profit: -betAmount,
          newBalance: parseFloat(user.balance.toString()),
        });
      }

      return res.json({
        action: 'hit',
        playerCards,
        dealerCards: [dealerCards[0]],
        playerValue,
        gameState: { playerCards, dealerCards, nonce },
      });
    }

    if (action === 'stand') {
      // Dealer plays
      let dealerValue = calculateHand(dealerCards);
      while (dealerValue < 17) {
        const newCard = ProvablyFairService.generateCard(
          serverSeed,
          clientSeed || 'default',
          nonce + playerCards.length + dealerCards.length
        );
        dealerCards.push(newCard);
        dealerValue = calculateHand(dealerCards);
      }

      const playerValue = calculateHand(playerCards);
      let isWin = false;
      let multiplier = 0;
      let result = 'lose';

      if (dealerValue > 21 || playerValue > dealerValue) {
        isWin = true;
        multiplier = playerValue === 21 && playerCards.length === 2 ? 1.5 : 1;
        result = 'win';
      } else if (playerValue === dealerValue) {
        multiplier = 0;
        result = 'push';
        isWin = false;
      }

      const payout = isWin ? betAmount * (multiplier + 1) : (result === 'push' ? betAmount : 0);
      const profit = payout - betAmount;

      user.balance = balance - betAmount + payout;
      await user.save();

      await Bet.create({
        userId,
        game: 'blackjack',
        betAmount,
        multiplier,
        payout,
        profit,
        isWin,
        gameData: { playerCards, dealerCards, playerValue, dealerValue, result },
        serverSeed: ProvablyFairService.hashServerSeed(serverSeed),
        clientSeed: clientSeed || 'default-client-seed',
        nonce,
      });

      return res.json({
        action: 'stand',
        playerCards,
        dealerCards,
        playerValue,
        dealerValue,
        isWin,
        result,
        multiplier,
        payout: parseFloat(payout.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        newBalance: parseFloat(user.balance.toString()),
      });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Error playing blackjack:', error);
    res.status(500).json({ error: 'Failed to play blackjack' });
  }
};

// Get bet history
export const getBetHistory = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { game, limit = 50 } = req.query;

    const where: any = { userId };
    if (game) {
      where.game = game;
    }

    const bets = await Bet.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit as string),
    });

    res.json({
      bets: bets.map(bet => ({
        id: bet.id,
        game: bet.game,
        betAmount: parseFloat(bet.betAmount.toString()),
        multiplier: parseFloat(bet.multiplier.toString()),
        payout: parseFloat(bet.payout.toString()),
        profit: parseFloat(bet.profit.toString()),
        isWin: bet.isWin,
        gameData: bet.gameData,
        createdAt: bet.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error getting bet history:', error);
    res.status(500).json({ error: 'Failed to get bet history' });
  }
};

// Get user statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    const bets = await Bet.findAll({ where: { userId } });

    const totalBets = bets.length;
    const totalWagered = bets.reduce((sum, bet) => sum + parseFloat(bet.betAmount.toString()), 0);
    const totalProfit = bets.reduce((sum, bet) => sum + parseFloat(bet.profit.toString()), 0);
    const wins = bets.filter(bet => bet.isWin).length;
    const losses = totalBets - wins;
    const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;

    res.json({
      totalBets,
      totalWagered: parseFloat(totalWagered.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      wins,
      losses,
      winRate: parseFloat(winRate.toFixed(2)),
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
};
