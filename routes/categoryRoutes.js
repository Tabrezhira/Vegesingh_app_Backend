const express = require('express');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/Category.controller');

const router = express.Router();

// Create a new category (with image upload)
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
router.post('/', upload.single('image'), createCategory);

// Get all categories
router.get('/', getCategories);

// Get a single category by ID
router.get('/:id', getCategoryById);

// Update a category
router.put('/:id', updateCategory);

// Delete a category
router.delete('/:id', deleteCategory);

module.exports = router;
