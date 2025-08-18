import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createAddress,
  getAddresses,
  getAddressByUserId,
  updateAddress,
  deleteAddress
} from '../controllers/Address.controller.js';

const router = express.Router();

// Create a new address
router.post('/', protect, createAddress);

// Get all addresses
router.get('/', protect, getAddresses);

// Get a single address by ID
router.get('/:id', protect, getAddressByUserId);

// Update an address
router.put('/:id', protect, updateAddress);

// Delete an address
router.delete('/:id', protect, deleteAddress);

export default router;
