const express = require('express')
const router = express.Router()

const {protect} = require('../middleware/authMiddleware')
const { register, login,updateProfile, profile, forgotPassword,resetPassword, verifyResetCode } = require('../controllers/User.controller')
const uploadToCloudinary = require('../middleware/uploadToCloudinary');
const User = require('../models/User.model');

require('dotenv').config();


//@route POST /api/users/register
//@desc Register a new user
//@access Public

router.post('/register',register)

//@route Post /api/users/login
//@desc Authenticate user
//@access Public

router.post('/login',login)



// @route POST /api/users/:userId/profile-pic
// @desc Upload profile picture for a specific user (admin or self)
// @access Private
router.post('/:userId/profile-pic', protect, uploadToCloudinary('profilePic'), async (req, res) => {
	try {
		// Only allow if admin or the user is updating their own profile
		if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
			return res.status(403).json({ message: 'Not authorized' });
		}
		const user = await User.findById(req.params.userId);
		if (!user) return res.status(404).json({ message: 'User not found' });
		if (!req.imageUrl) return res.status(400).json({ message: 'No image uploaded' });
		user.profilePic = req.imageUrl;
		await user.save();
		res.status(200).json({ message: 'Profile picture updated', profilePic: req.imageUrl });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});


// @route POST /api/users/reset-password
// @desc Reset the user's password
// @access Public
router.post('/reset-password', resetPassword)

// @route POST /api/users/verify-reset-code
// @desc Verify the 6-digit reset code
// @access Public
router.post('/verify-reset-code', verifyResetCode)

// @route POST /api/users/forgot-password
// @desc Initiate password reset
// @access Public
router.post('/forgot-password', forgotPassword)







// @route GET /api/users/profile
// @desc Get logged-in user's profile with orders and cart
// @access Private
router.get('/profile', protect, profile)

// @route PUT /api/users/profile
// @desc Update logged-in user's profile
// @access Private
router.put('/profile', protect, updateProfile)

// Upload profile picture and update user
router.post('/:userId', uploadToCloudinary('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!req.imageUrl) return res.status(400).json({ message: 'No image uploaded' });
    user.profilePic = req.imageUrl;
    await user.save();
    res.status(200).json({ message: 'Profile picture updated', profilePic: req.imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;



module.exports = router