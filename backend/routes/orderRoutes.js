import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getAllOrders,
  deleteOrder,
  createCheckoutSession,
  getStripeSessionStatus,
  getOrderBySessionId,
  updateOrderToPaid,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/session-status', protect, getStripeSessionStatus);
router.get('/order-by-session-id', protect, getOrderBySessionId);

router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders);

router.route('/mine').get(protect, getMyOrders);

router
  .route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;
