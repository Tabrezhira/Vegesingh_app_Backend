
import express from 'express';
import multer from 'multer';
import cloudinaryModule from 'cloudinary';
import streamifier from 'streamifier';
import Product from '../models/Product.model.js';
import dotenv from 'dotenv';
dotenv.config();

const cloudinary = cloudinaryModule.v2;

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_Name,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload product image and update product
router.post('/:productId', upload.single('img'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    product.img = result.secure_url;
    await product.save();
    res.status(200).json({ message: 'Product image updated', img: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
