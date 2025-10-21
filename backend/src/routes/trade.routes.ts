import { Router } from 'express';
import { TradeController } from '../controllers/trade.controller';

const router = Router();

router.get('/', TradeController.getAll);
router.get('/:id', TradeController.getById);
router.post('/', TradeController.create);
router.post('/:id/execute', TradeController.execute);
router.post('/:id/cancel', TradeController.cancel);

export default router;
