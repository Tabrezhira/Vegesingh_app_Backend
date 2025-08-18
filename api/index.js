import serverless from 'serverless-http'
import app from '../server.js'

export const config = { runtime: 'nodejs20.x' }
export default serverless(app)
