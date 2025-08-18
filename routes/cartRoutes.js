import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} from '../controllers/Cart.controller.js';

const router = express.Router();

// Get user's cart
router.get('/:userId', getCart);

// Add or update item in cart
router.post('/:userId', addToCart);

// Remove item from cart
router.delete('/:userId', removeFromCart);

// Clear cart
router.delete('/:userId/clear', clearCart);

export default router;
