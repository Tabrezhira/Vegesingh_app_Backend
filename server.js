const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()
const {connectDB} = require('./config/db')
const userRoutes = require('./routes/userRoutes')


const addressRoutes = require('./routes/addressRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productImgRouter = require('./routes/productImgRouter')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')

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


app.use('/api/product-img', productImgRouter)

app.use('/api/products', productRoutes)

app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.listen(Port,()=>{
    console.log(`Server is running on http://localhost:${Port}`)
})

// module.exports = app;   //unmask for Vercel only 