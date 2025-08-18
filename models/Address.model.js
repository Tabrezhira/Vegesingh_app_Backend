import mongoose from 'mongoose';

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

const Address = mongoose.model('Address', addressSchema);
export default Address;
