const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Cart = require('../models/Cart.model');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // user from auth middleware (req.user)
    const userId = req.user._id;
    const paymentType = req.body.paymentType;


    // Fetch user to get address ref
    const userDoc = await User.findById(userId);
    if (!userDoc || !userDoc.address) {
      return res.status(400).json({ message: 'User has no address on file' });
    }
    // Fetch the full address object
    const Address = require('../models/Address.model');
    const addressObj = await Address.findById(userDoc.address);
    if (!addressObj) {
      return res.status(400).json({ message: 'Address not found' });
    }

    // Get cart for user
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Embed static product details in each order item
    const items = cart.items.map(item => ({
      product: {
        _id: item.product._id,
        name: item.product.name,
        img: item.product.img,
        price: item.product.price
      },
      quantity: item.quantity,
      price: item.product.price
    }));
    const total = cart.total;

    // Map address fields to required static fields for order
    const orderAddress = {
      name: userDoc.name,
      mobile: userDoc.mobile,
      street: addressObj.street,
      city: addressObj.city,
      pincode: addressObj.pincode
    };

    // Generate orderId: ddmmyy_NN (NN = count+1 for today)
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const datePrefix = `${dd}${mm}${yy}`;
    const todayCount = await Order.countDocuments({
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      }
    });
    const orderId = `${datePrefix}_${String(todayCount + 1).padStart(2, '0')}`;

    const order = new Order({
      orderId,
      user: userId,
      items,
      total,
      address: orderAddress,
      paymentType
    });
  await order.save();
  // Add order ref to user
  await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

  // Delete the user's cart and remove cart ref from user
  await Cart.findOneAndDelete({ user: userId });
  await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } });

  res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all orders (admin)
exports.getOrders = async (req, res) => {
  try {
  const orders = await Order.find().populate('user');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
  const order = await Order.findById(req.params.id).populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all orders for a user
exports.getOrdersByUser = async (req, res) => {
  try {
  const orders = await Order.find({ user: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
