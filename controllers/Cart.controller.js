const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Add or update item in cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] });
      // Set cart ref in user
      const User = require('../models/User.model');
      await User.findByIdAndUpdate(
        req.params.userId,
        { cart: cart._id },
        { new: true }
      );
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    // Calculate total
    cart.total = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.total += prod.price * item.quantity;
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => !item.product.equals(productId));
    // Recalculate total
    cart.total = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.total += prod.price * item.quantity;
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    cart.total = 0;
    await cart.save();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
