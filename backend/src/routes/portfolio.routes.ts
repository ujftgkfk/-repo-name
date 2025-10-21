import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';

const router = Router();

router.get('/', PortfolioController.getAll);
router.get('/:id', PortfolioController.getById);
router.post('/', PortfolioController.create);
router.put('/:id', PortfolioController.update);
router.delete('/:id', PortfolioController.delete);
router.get('/:id/positions', PortfolioController.getPositions);
router.post('/:id/update-values', PortfolioController.updatePositionValues);

export default router;
