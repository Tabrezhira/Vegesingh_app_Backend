const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address" ],
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type:String,
        enum:["customer","admin","delivery"],
        default:"customer"
    },
    mobile: {
        type: Number,
        required: true,
        maxlength: 10,
        match: [/^\d{10,15}$/, 'Please enter a valid mobile number']
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: false
    },
    profilePic: {
        type: String,
        required: false
    },
    resetCode: {
        type: String,
        required: false
    },
    resetCodeExpiry: {
        type: Date,
        required: false
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false
    }],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: false
    }
},{timestamps:true});

// Password Hash middleware

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;