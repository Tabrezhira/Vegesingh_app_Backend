const mongoose = require('mongoose');

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

module.exports = mongoose.model('Category', categorySchema);
