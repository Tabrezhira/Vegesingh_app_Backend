const express = require('express');
const { createAddress, getAddresses } = require('../controllers/Address.controller');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');


// @route GET /api/address/user/:userId
// @desc Get address by user ID
router.get('/user/:userId', require('../controllers/Address.controller').getAddressByUserId);

// @route DELETE /api/address/:id
// @desc Delete an address (protected)
router.delete('/:id', protect, require('../controllers/Address.controller').deleteAddress);



// @route POST /api/address
// @desc Create a new address (protected)
router.post('/', protect, createAddress);


// @route PUT /api/address/:id
// @desc Update an address (protected)
router.put('/:id', protect, require('../controllers/Address.controller').updateAddress);

// @route GET /api/address
// @desc Get all addresses
router.get('/', getAddresses);

module.exports = router;
