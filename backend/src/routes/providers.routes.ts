import { Router } from 'express';
import {
  getAllProviders,
  getProviderGames,
  getAllGames,
  getPopularGames,
  getGamesByCategory,
  launchGame,
  syncProviderGames,
} from '../controllers/providers.controller';

const router = Router();

// Get all providers
router.get('/providers', getAllProviders);

// Get games from specific provider
router.get('/providers/:providerSlug/games', getProviderGames);

// Sync games from provider (admin endpoint)
router.post('/providers/:providerSlug/sync', syncProviderGames);

// Get all games with optional filters
router.get('/games', getAllGames);

// Get popular games
router.get('/games/popular', getPopularGames);

// Get games by category
router.get('/games/category/:category', getGamesByCategory);

// Launch a game
router.post('/games/launch', launchGame);

export default router;
