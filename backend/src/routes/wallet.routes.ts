import { Router } from 'express';
import {
  getBalance,
  deposit,
  getUser,
  createUser,
} from '../controllers/wallet.controller';

const router = Router();

router.post('/users', createUser);
router.get('/users/:userId', getUser);
router.get('/users/:userId/balance', getBalance);
router.post('/users/:userId/deposit', deposit);

export default router;
