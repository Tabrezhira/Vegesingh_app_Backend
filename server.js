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


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ⚡ Middlewares
app.use(cors())
app.use(express.json({ limit: '10kb' }))

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




// Only start local server if running outside Vercel
if (!process.env.VERCEL) {
  if (process.env.NODE_ENV === 'development') {
    console.log("hello")
  }

  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`)
  })
}



export default app
