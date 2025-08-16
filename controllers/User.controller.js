// @route POST /api/users/reset-password
// @desc Reset the user's password after code verification
// @access Public
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Optionally, check if resetCode and resetCodeExpiry are still present (for extra security)
        user.password = newPassword;
        user.resetCode = undefined;
        user.resetCodeExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
// @route POST /api/users/verify-reset-code
// @desc Verify the 6-digit reset code
// @access Public
const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.resetCode || !user.resetCodeExpiry) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }
        if (user.resetCode !== code) {
            return res.status(400).json({ message: 'Invalid code' });
        }
        if (user.resetCodeExpiry < Date.now()) {
            return res.status(400).json({ message: 'Code expired' });
        }
        // Optionally clear the code after successful verification
        user.resetCode = undefined;
        user.resetCodeExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: 'Code verified' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')



//@route POST /api/users/register
//@desc Register a new user
//@access Public

const register =async(req, res) => {
    const {name, email, password} = req.body;
    try {
        //Registration logic
        let user = await User.findOne({email})
        if(user) return res.status(400).json({message:'User already exists'})
        
        user = new User({name, email, password})

        await user.save()

        // Create JWT Payload

        const payload = {user: {id: user._id, role: user.role}}

        // Sign and return the token along with user data

        jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '40h'},(err,token) => {
            if(err) throw err

            // Send the user and token in response
            res.status(201).json({
                user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            },
            token: token
            })
        })


    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error')
    }
}

//@route Post /api/users/login
//@desc Authenticate user
//@access Public

const login =  async(req,res)=>{
    const {email, password} = req.body

    try {
        // Find the user by email
        let user = await User.findOne({email})
        if(!user) return res.status(400).json({message:"Invalid Credentials"})
        
            const isMatch = await user.matchPassword(password)

            if(!isMatch){
                return res.status(400).json({message:'Invalid Credentials'})
            }

        // Create JWT Payload

            const payload = {user: {id: user._id, role: user.role}}

        // Sign and return the token along with user data

            jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '40h'},(err,token) => {
            if(err) throw err

            // Send the user and token in response
            res.json({
                user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            },
            token: token
            })
        })


    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error')
    }
}

//@route get /api/users/profile
//@desc Get logged-in user's profile (Protect Route)
//@access Private
const profile =  async(req, res)=>{
    res.json(req.user);

}


// @route POST /api/users/forgot-password
// @desc Initiate password reset (send email with reset link/token)
// @access Public

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate a 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Store the code and expiry (10 min) on the user
        user.resetCode = code;
        user.resetCodeExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        // TODO: Send the code to user's email (implement email sending here)
        // For now, just return the code in response (for testing)
        return res.status(200).json({ message: 'Password reset code sent to email', code });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {register,login,profile,forgotPassword,verifyResetCode,resetPassword}
