import Address from '../models/Address.model.js';
import User from '../models/User.model.js';

// Create a new address
export const createAddress = async (req, res) => {
  try {
    const { address, street, city, pincode } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user.address) {
      return res.status(400).json({ message: 'User already has an address' });
    }
    const newAddress = new Address({ address, street, city, pincode });
    await newAddress.save();
    // Add address ref to user
    await User.findByIdAndUpdate(userId, { address: newAddress._id });
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get address by user ID
export const getAddressByUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('address');
    if (!user || !user.address) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(user.address);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const { address, street, city, pincode } = req.body;
    const addressId = req.params.id;
    const updated = await Address.findByIdAndUpdate(
      addressId,
      { address, street, city, pincode },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const deleted = await Address.findByIdAndDelete(addressId);
    if (!deleted) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
