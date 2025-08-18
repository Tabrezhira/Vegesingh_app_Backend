import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { connectDB } from './config/db.js'

// Routes
import userRoutes from './routes/userRoutes.js'
import addressRoutes from './routes/addressRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

// AdminJS
import { adminJs, adminRouter } from './admin.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ⚡ Middlewares
app.use(cors())   // Enable CORS
app.use(express.json({ limit: '10kb' })) // Prevent large payload attacks

// Connect DB
connectDB()

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to Vegesingh API!')
})

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/address', addressRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

// 🔑 AdminJS
app.use(adminJs.options.rootPath, adminRouter)

if (process.env.NODE_ENV === 'development') {
  adminJs.watch()
}

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
  console.log(`⚡ AdminJS available at http://localhost:${PORT}${adminJs.options.rootPath}`)
})

// export default app // (for Vercel/Serverless)
