const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/Category.controller');

const router = express.Router();

// Create a new category (with image upload)
const uploadToCloudinary = require('../middleware/uploadToCloudinary');
router.post('/', uploadToCloudinary('image'), createCategory);

// Get all categories
router.get('/', getCategories);

// Get a single category by ID
router.get('/:id', getCategoryById);




// Update a category (admin only)
router.put('/:id', protect, admin, uploadToCloudinary('image'),updateCategory);

// Delete a category (admin only)
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
