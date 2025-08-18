import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import bcrypt from 'bcrypt'

// Models
import User from './models/User.model.js'
import Product from './models/Product.model.js'
import Category from './models/Category.model.js'
import Address from './models/Address.model.js'
import Cart from './models/Cart.model.js'
import Order from './models/Order.model.js'

// Register adapter
AdminJS.registerAdapter({
  Database: AdminJSMongoose.Database,
  Resource: AdminJSMongoose.Resource,
})

const adminJs = new AdminJS({
  resources: [
    { resource: User },
    { resource: Product },
    { resource: Category },
    { resource: Address },
    { resource: Cart },
    { resource: Order },
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Vegesingh Admin',
    logo: false,
  },
  dashboard: {
    handler: async () => {
      const userCount = await User.countDocuments();
      const productCount = await Product.countDocuments();
      const orderCount = await Order.countDocuments();
      return {
        text: `Welcome to Vegesingh Admin! Users: ${userCount}, Products: ${productCount}, Orders: ${orderCount}`,
      };
    },
    component: false,
  },
})

const DEFAULT_ADMIN = {
  email: 'admin@vegesingh.com',
  password: 'admin123',
};
 
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return { email: DEFAULT_ADMIN.email };
      }
      return null;
    },
    cookieName: 'adminjs',
    cookiePassword: 'supersecret',
  }
);

export { adminJs, adminRouter }
