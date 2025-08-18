
import multer from 'multer';
import cloudinaryModule from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
dotenv.config();

const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_Name,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = (fieldName = 'image') => [
  upload.single(fieldName),
  async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    try {
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
      req.imageUrl = result.secure_url;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Cloudinary upload failed', error });
    }
  }
];

export default uploadToCloudinary;
