const Address = require('../models/Address.model');

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const { address, street, city, pincode } = req.body;
    const newAddress = new Address({ address, street, city, pincode });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
