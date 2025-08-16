const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/Cart.controller');

const router = express.Router();

// Get user's cart
router.get('/:userId', getCart);

// Add or update item in cart
router.post('/:userId', addToCart);

// Remove item from cart
router.delete('/:userId', removeFromCart);

// Clear cart
router.delete('/:userId/clear', clearCart);

module.exports = router;
