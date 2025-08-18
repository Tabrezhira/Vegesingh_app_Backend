import Product from '../models/Product.model.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, qty, reviews, star, detail, popular, category } = req.body;
    // Generate random reviews and star if not provided
    const randomReviews = reviews !== undefined ? reviews : Math.floor(Math.random() * 1000);
    const randomStar = star !== undefined ? star : (Math.random() * 5).toFixed(1);
  // img comes from Cloudinary middleware
  const img = req.imageUrl;
    const product = new Product({
      name,
      price,
      qty,
      reviews: randomReviews,
      star: randomStar,
      detail,
      popular,
      category,
      img
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, qty, reviews, star, detail, popular, category } = req.body;
    console.log(req.body)
    // Use Cloudinary middleware image if present, else fallback to body
    const img = req.imageUrl || req.body.img;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, qty, reviews, star, detail, popular, category, img },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
