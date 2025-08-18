import serverless from 'serverless-http'
import app from '../server.js'

// Vercel Node runtime (use project setting Node 20.x). Add regions or limits if needed.
export const config = { runtime: 'nodejs' }
export default serverless(app)
