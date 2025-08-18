import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  qty: {
    type: Number,
    required: true,
    min: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  star: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  detail: {
    type: String,
    maxlength: 170
  },
  popular: {
    type: Boolean,
    default: false
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  img: {
    type: String,
    required: false
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
