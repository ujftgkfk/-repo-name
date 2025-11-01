import { Router } from 'express';
import {
  playDice,
  playSlots,
  playRoulette,
  playBlackjack,
  getBetHistory,
  getUserStats,
} from '../controllers/games.controller';

const router = Router();

// Game routes
router.post('/dice', playDice);
router.post('/slots', playSlots);
router.post('/roulette', playRoulette);
router.post('/blackjack', playBlackjack);

// History and stats
router.get('/bets/:userId', getBetHistory);
router.get('/stats/:userId', getUserStats);

export default router;
