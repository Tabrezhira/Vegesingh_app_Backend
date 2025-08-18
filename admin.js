import AdminJS, { ComponentLoader } from 'adminjs'
import path from 'path'
import { fileURLToPath } from 'url'
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

// Custom component loader for dashboard (AdminJS v7 compatible)
const componentLoader = new ComponentLoader()
// IMPORTANT: Use a relative path for AdminJS bundler (absolute windows paths can break)
let DashboardComponent = null
try {
  DashboardComponent = componentLoader.add('Dashboard', './admin-components/Dashboard.jsx')
  console.log('[AdminJS] Custom dashboard component registered.')
} catch (e) {
  console.warn('[AdminJS] Dashboard component load failed, using fallback:', e.message)
}

const adminJs = new AdminJS({
  componentLoader,
  resources: [
    {
      resource: User,
      options: {
        navigation: { name: 'User Management', icon: 'User' },
      },
    },
    {
      resource: Address,
      options: {
        navigation: { name: 'User Management', icon: 'MapPin' },
      },
    },
    {
      resource: Product,
      options: {
        navigation: { name: 'Store', icon: 'ShoppingCart' },
        listProperties: ['name', 'price', 'qty', 'category', 'popular', 'createdAt'],
        showProperties: ['name','price','qty','category','popular','reviews','star','detail','img','createdAt','updatedAt'],
        editProperties: ['name','price','qty','category','popular','detail','img'],
        filterProperties: ['name','category','popular','createdAt'],
        sort: { sortBy: 'createdAt', direction: 'desc' },
        properties: {
          name: { isTitle: true },
          price: { components: {}, description: 'Product price in INR' },
          qty: { description: 'Inventory quantity (must be >= 0)' },
          detail: { type: 'richtext', description: 'Short marketing description (<=170 chars)' },
          img: { description: 'URL of product image (uploaded via API)' },
          popular: { description: 'Mark product as featured/popular' },
          createdAt: { isVisible: { list: true, edit: false, filter: true, show: true } },
          updatedAt: { isVisible: { list: false, edit: false, filter: false, show: true } },
        },
        actions: {
          new: { before: async (req) => req },
          edit: { before: async (req) => req },
          markPopular: {
            actionType: 'record',
            icon: 'StarFilled',
            label: 'Mark Popular',
            guard: 'Mark this product as popular?',
            handler: async (request, response, context) => {
              const { record } = context;
              if (record) {
                await record.update({ popular: true });
              }
              return { record: record.toJSON() };
            },
            isVisible: (context) => !context.record?.param('popular'),
          },
          unmarkPopular: {
            actionType: 'record',
            icon: 'Star',
            label: 'Unmark Popular',
            guard: 'Remove popular flag?',
            handler: async (request, response, context) => {
              const { record } = context;
              if (record) {
                await record.update({ popular: false });
              }
              return { record: record.toJSON() };
            },
            isVisible: (context) => context.record?.param('popular'),
          },
        },
      },
    },
    {
      resource: Category,
      options: {
        navigation: { name: 'Store', icon: 'Tag' },
      },
    },
    {
      resource: Order,
      options: {
        navigation: { name: 'Orders', icon: 'Archive' },
      },
    },
    {
      resource: Cart,
      options: {
        navigation: { name: 'Orders', icon: 'ShoppingBag' },
      },
    },
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Vegesingh Admin',
    logo: false,
  },
  dashboard: {
    handler: async () => {
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

        const [
          userCount,
          productCount,
          orderCount,
          popularProducts,
            recentOrders,
          revenueAgg,
          usersToday,
          ordersToday,
          revenueTodayAgg,
          statusAgg,
          ordersLast7Agg,
        ] = await Promise.all([
          User.countDocuments(),
          Product.countDocuments(),
          Order.countDocuments(),
          Product.find({ popular: true }).select('name price').limit(5).lean(),
          Order.find().sort({ createdAt: -1 }).limit(5).select('orderId total status createdAt').lean(),
          Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$total' } } },
          ]),
          User.countDocuments({ createdAt: { $gte: startOfDay } }),
          Order.countDocuments({ createdAt: { $gte: startOfDay } }),
          Order.aggregate([
            { $match: { status: 'delivered', createdAt: { $gte: startOfDay } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
          ]),
          Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ]),
          Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orders: { $sum: 1 }, revenue: { $sum: '$total' } } },
            { $sort: { _id: 1 } },
          ]),
        ])

        const revenue = revenueAgg?.[0]?.total || 0;
        const revenueToday = revenueTodayAgg?.[0]?.total || 0;
        const statusCounts = statusAgg.reduce((acc, cur) => { acc[cur._id] = cur.count; return acc; }, {});
        const ordersLast7 = ordersLast7Agg.map(d => ({ date: d._id, orders: d.orders, revenue: d.revenue }));

        return {
          stats: { userCount, productCount, orderCount, revenue },
          today: { usersToday, ordersToday, revenueToday },
          statusCounts,
          ordersLast7,
          popularProducts,
          recentOrders,
          generatedAt: new Date().toISOString(),
          fallback: false,
          version: 'dash:v2',
        }
      } catch (e) {
        return { text: 'Vegesingh Admin Dashboard (fallback)', error: e.message, fallback: true }
      }
    },
    component: DashboardComponent || false,
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
