const express = require('express');
const {protect, admin} = require('../middleware/authMiddleware')

const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/Order.controller');





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

module.exports = router;
