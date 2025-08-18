
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
// import productImgRouter from './routes/productImgRouter.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

app.use(express.json())
app.use(cors())

dotenv.config()
const Port = process.env.PORT || 3000;
// Connect 
connectDB()

app.get('/', (req,res) => {
    res.send('Welcome to Vegesingh API!')
})

// API Routes

app.use('/api/users', userRoutes)

app.use('/api/address', addressRoutes)

app.use('/api/categories', categoryRoutes)


// app.use('/api/product-img', productImgRouter)

app.use('/api/products', productRoutes)

app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.listen(Port,()=>{
    console.log(`Server is running on http://localhost:${Port}`)
})

// module.exports = app;   //unmask for Vercel only 