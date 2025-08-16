const express = require('express');
const { createAddress, getAddresses } = require('../controllers/Address.controller');

const router = express.Router();

// @route POST /api/address
// @desc Create a new address
router.post('/', createAddress);

// @route GET /api/address
// @desc Get all addresses
router.get('/', getAddresses);

module.exports = router;
