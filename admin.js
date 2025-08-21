// import AdminJS from 'adminjs'
// import AdminJSExpress from '@adminjs/express'
// import * as AdminJSMongoose from '@adminjs/mongoose'


// // Models
// import User from './models/User.model.js'
// import Product from './models/Product.model.js'
// import Category from './models/Category.model.js'
// import Address from './models/Address.model.js'
// import Cart from './models/Cart.model.js'
// import Order from './models/Order.model.js'

// // Register adapter
// AdminJS.registerAdapter({
//   Database: AdminJSMongoose.Database,
//   Resource: AdminJSMongoose.Resource,
// })

// // Custom component loader for dashboard (AdminJS v7 compatible)
// // Removed custom ComponentLoader to avoid Rollup native optional dependency issues on Vercel.
// // If you want to restore the rich dashboard locally, reintroduce ComponentLoader and add rollup as a prod dependency.

// const adminJs = new AdminJS({
//   resources: [
//     {
//       resource: User,
//       options: {
//         navigation: { name: 'User Management', icon: 'User' },
//       },
//     },
//     {
//       resource: Address,
//       options: {
//         navigation: { name: 'User Management', icon: 'MapPin' },
//       },
//     },
//     {
//       resource: Product,
//       options: {
//         navigation: { name: 'Store', icon: 'ShoppingCart' },
//         listProperties: ['name', 'price', 'qty', 'category', 'popular', 'createdAt'],
//         showProperties: ['name','price','qty','category','popular','reviews','star','detail','img','createdAt','updatedAt'],
//         editProperties: ['name','price','qty','category','popular','detail','img'],
//         filterProperties: ['name','category','popular','createdAt'],
//         sort: { sortBy: 'createdAt', direction: 'desc' },
//         properties: {
//           name: { isTitle: true },
//           price: { components: {}, description: 'Product price in INR' },
//           qty: { description: 'Inventory quantity (must be >= 0)' },
//           detail: { type: 'richtext', description: 'Short marketing description (<=170 chars)' },
//           img: { description: 'URL of product image (uploaded via API)' },
//           popular: { description: 'Mark product as featured/popular' },
//           createdAt: { isVisible: { list: true, edit: false, filter: true, show: true } },
//           updatedAt: { isVisible: { list: false, edit: false, filter: false, show: true } },
//         },
//         actions: {
//           new: { before: async (req) => req },
//           edit: { before: async (req) => req },
//           markPopular: {
//             actionType: 'record',
//             icon: 'StarFilled',
//             label: 'Mark Popular',
//             guard: 'Mark this product as popular?',
//             handler: async (request, response, context) => {
//               const { record } = context;
//               if (record) {
//                 await record.update({ popular: true });
//               }
//               return { record: record.toJSON() };
//             },
//             isVisible: (context) => !context.record?.param('popular'),
//           },
//           unmarkPopular: {
//             actionType: 'record',
//             icon: 'Star',
//             label: 'Unmark Popular',
//             guard: 'Remove popular flag?',
//             handler: async (request, response, context) => {
//               const { record } = context;
//               if (record) {
//                 await record.update({ popular: false });
//               }
//               return { record: record.toJSON() };
//             },
//             isVisible: (context) => context.record?.param('popular'),
//           },
//         },
//       },
//     },
//     {
//       resource: Category,
//       options: {
//         navigation: { name: 'Store', icon: 'Tag' },
//       },
//     },
//     {
//       resource: Order,
//       options: {
//         navigation: { name: 'Orders', icon: 'Archive' },
//       },
//     },
//     {
//       resource: Cart,
//       options: {
//         navigation: { name: 'Orders', icon: 'ShoppingBag' },
//       },
//     },
//   ],
//   rootPath: '/admin',
// //   Removed custom branding and dashboard for default AdminJS appearance
//   branding: {
//     companyName: 'Vegesingh Admin',
//     logo: false,
//   },
//   dashboard: {
//     handler: async () => {
//       const [userCount, productCount, orderCount] = await Promise.all([
//         User.countDocuments(),
//         Product.countDocuments(),
//         Order.countDocuments(),
//       ])
//       return {
//         text: `Vegesingh Admin Dashboard\nUsers: ${userCount} | Products: ${productCount} | Orders: ${orderCount}`,
//       }
//     },
//     component: false,
//   },
// })

// const DEFAULT_ADMIN = { email: 'admin@vegesingh.com', password: 'admin123' }

// const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
//   adminJs,
//   {
//     authenticate: async (email, password) => {
//       if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
//         return { email: DEFAULT_ADMIN.email }
//       }
//       return null
//     },
//     cookieName: 'adminjs',
//     cookiePassword: 'supersecret',
//     // Add express-session options to fix deprecation warnings
//     resave: false,
//     saveUninitialized: false,
//   }
// )

// export { adminJs, adminRouter }
