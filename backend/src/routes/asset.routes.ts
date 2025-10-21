import { Router } from 'express';
import { AssetController } from '../controllers/asset.controller';

const router = Router();

router.get('/', AssetController.getAll);
router.get('/:id', AssetController.getById);
router.post('/', AssetController.create);
router.put('/:id', AssetController.update);
router.patch('/:id/price', AssetController.updatePrice);
router.delete('/:id', AssetController.delete);

export default router;
