import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 255
  },
  image: {
    type: String,
    required: false
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
