const express = require('express')
const router = express.Router()

const {protect} = require('../middleware/authMiddleware')
const { register, login,updateProfile, profile, forgotPassword,resetPassword, verifyResetCode } = require('../controllers/User.controller')

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




//@route POST /api/users/register
//@desc Register a new user
//@access Public

router.post('/register',register)

//@route Post /api/users/login
//@desc Authenticate user
//@access Public

router.post('/login',login)


// @route GET /api/users/profile
// @desc Get logged-in user's profile with orders and cart
// @access Private
router.get('/profile', protect, profile)

// @route PUT /api/users/profile
// @desc Update logged-in user's profile
// @access Private
router.put('/profile', protect, updateProfile)


module.exports = router