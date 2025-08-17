const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/Product.controller');

const router = express.Router();

const uploadToCloudinary = require('../middleware/uploadToCloudinary');
// Create a new product (with optional image upload)
router.post('/', uploadToCloudinary('img'), createProduct);

// Get all products
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById);


const { protect, admin } = require('../middleware/authMiddleware');

// Update a product (admin only)
router.put('/:id', protect, admin, updateProduct);

// Delete a product (admin only)
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
