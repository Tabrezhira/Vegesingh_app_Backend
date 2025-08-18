const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.model');
const Category = require('./models/Category.model');
const Product = require('./models/Product.model');
const Address = require('./models/Address.model');
const Cart = require('./models/Cart.model');
const Order = require('./models/Order.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const randomStr = (len = 8) => Math.random().toString(36).substring(2, 2 + len);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seed() {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Address.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});

  // 1. Categories
  const categories = [];
  for (let i = 0; i < 10; i++) {
    categories.push(await Category.create({
      name: `Category${i}`,
      description: `Description for category ${i}`,
      image: `https://placehold.co/100x100?text=Cat${i}`
    }));
  }

  // 2. Products
  const products = [];
  for (let i = 0; i < 10; i++) {
    const cat = categories[randomInt(0, categories.length - 1)];
    products.push(await Product.create({
      name: `Product${i}`,
      price: randomInt(10, 100),
      qty: randomInt(1, 50),
      reviews: randomInt(0, 1000),
      star: (Math.random() * 5).toFixed(1),
      detail: `Detail for product ${i}`,
      popular: Math.random() > 0.5,
      category: cat._id,
      img: `https://placehold.co/100x100?text=Prod${i}`
    }));
  }

  // 3. Users & Addresses
  const users = [];
  for (let i = 0; i < 10; i++) {
    const address = await Address.create({
      address: `Address ${i}`,
      street: `Street ${i}`,
      city: `City${i}`.slice(0, 6),
      pincode: `${randomInt(100000, 999999)}`.slice(0, 6)
    });
    const password = await bcrypt.hash('password', 10);
    users.push(await User.create({
      name: `User${i}`,
      email: `user${i}@test.com`,
      password,
      role: i === 0 ? 'admin' : 'customer',
      mobile: `9${randomInt(100000000, 999999999)}`.slice(0, 10),
      address: address._id,
      profilePic: `https://placehold.co/100x100?text=User${i}`
    }));
  }

  // 4. Carts
  const carts = [];
  for (let i = 0; i < 10; i++) {
    const user = users[i];
    const items = [
      { product: products[randomInt(0, products.length - 1)]._id, quantity: randomInt(1, 3) },
      { product: products[randomInt(0, products.length - 1)]._id, quantity: randomInt(1, 3) }
    ];
    const total = items.reduce((sum, item) => {
      const prod = products.find(p => p._id.equals(item.product));
      return sum + (prod ? prod.price * item.quantity : 0);
    }, 0);
    carts.push(await Cart.create({ user: user._id, items, total }));
    await User.findByIdAndUpdate(user._id, { cart: carts[i]._id });
  }

  // 5. Orders
  for (let i = 0; i < 10; i++) {
    const user = users[randomInt(0, users.length - 1)];
    const address = await Address.findById(user.address);
    const items = [
      { product: products[randomInt(0, products.length - 1)]._id, quantity: randomInt(1, 2), price: randomInt(10, 100) },
      { product: products[randomInt(0, products.length - 1)]._id, quantity: randomInt(1, 2), price: randomInt(10, 100) }
    ];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      user: user._id,
      items,
      total,
      address: address._id,
      status: 'pending',
      paymentStatus: 'pending',
      paymentType: Math.random() > 0.5 ? 'cash' : 'upi'
    });
    await User.findByIdAndUpdate(user._id, { $push: { orders: order._id } });
  }

  console.log('Seeded 10 documents for each module with realistic relationships.');
  process.exit();
}

seed();
