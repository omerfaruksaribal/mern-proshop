import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Admin Only Routes
router.route('/').get(protect, admin, getOrders);
router.route('/:id').get(protect, admin, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
