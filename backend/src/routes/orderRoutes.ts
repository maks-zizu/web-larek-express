import { Router } from 'express';
import { celebrate } from 'celebrate';
import createOrder from '../controllers/orderController';
import createOrderValidator from '../validators/order';

const router = Router();

router.post('/', celebrate(createOrderValidator), createOrder);

export default router;
