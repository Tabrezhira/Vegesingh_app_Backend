import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/Product.controller.js';
import uploadToCloudinary from '../middleware/uploadToCloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
// Create a new product (with optional image upload)
router.post('/', uploadToCloudinary('img'), createProduct);

// Get all products
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById);



// Update a product (admin only)
router.put('/:id', protect, admin,uploadToCloudinary('img'), updateProduct);

// Delete a product (admin only)
router.delete('/:id', protect, admin, deleteProduct);

export default router;
