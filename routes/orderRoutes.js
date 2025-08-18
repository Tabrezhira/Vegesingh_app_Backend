import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder
} from '../controllers/Order.controller.js';

const router = express.Router();

// Create a new order (user must be authenticated)
router.post('/', protect, createOrder);

// Get all orders (admin only)
router.get('/', protect, admin, getOrders);

// Get a single order by ID (user must be authenticated)
router.get('/:id', protect, getOrderById);

// Get all orders for a user (user must be authenticated)
router.get('/user/:userId', protect, getOrdersByUser);

// Update order status (admin only)
router.put('/:id', protect, admin, updateOrderStatus);

// Delete an order (admin only)
router.delete('/:id', protect, admin, deleteOrder);

export default router;
