import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getAllProducts, createProduct } from '../controllers/productController';
import createProductValidator from '../validators/product';

const router = Router();

router.get('/', getAllProducts);
router.post('/', celebrate(createProductValidator), createProduct);

export default router;
