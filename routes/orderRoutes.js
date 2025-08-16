const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/Order.controller');

const router = express.Router();

// Create a new order
router.post('/', createOrder);

// Get all orders (admin)
router.get('/', getOrders);

// Get a single order by ID
router.get('/:id', getOrderById);

// Get all orders for a user
router.get('/user/:userId', getOrdersByUser);

// Update order status
router.put('/:id', updateOrderStatus);

// Delete an order
router.delete('/:id', deleteOrder);

module.exports = router;
