const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    maxlength: 22,
    required: true
  },
  street: {
    type: String,
    maxlength: 22,
    required: true
  },
  city: {
    type: String,
    maxlength: 6,
    required: true
  },
  pincode: {
    type: String,
    maxlength: 6,
    required: true
  }
});

module.exports = mongoose.model('Address', addressSchema);
