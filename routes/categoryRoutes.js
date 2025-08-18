import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/Category.controller.js';
import uploadToCloudinary from '../middleware/uploadToCloudinary.js';

const router = express.Router();

// Create a new category (admin only)
router.post('/', protect, admin, uploadToCloudinary('img'), createCategory);

// Get all categories
router.get('/', getCategories);

// Get a single category by ID
router.get('/:id', getCategoryById);

// Update a category (admin only)
router.put('/:id', protect, admin, uploadToCloudinary('img'), updateCategory);

// Delete a category (admin only)
router.delete('/:id', protect, admin, deleteCategory);

export default router;
