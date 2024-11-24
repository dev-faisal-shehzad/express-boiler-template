// App Configuration
export const APP_NAME = process.env.APP_NAME || 'Node Template'
export const APP_HOST = process.env.APP_HOST || 'http://localhost'
export const APP_PORT = process.env.APP_PORT || 3000
export const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000'
export const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'C0mplexpass'
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const SAVE_LOGS = process.env.SAVE_LOGS || 'true'

// MongoDB Configuration
export const MONGO_DB_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017'
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'testMongoDB'

// Mailer Configuration
export const MAILER_HOST = process.env.MAILER_HOST || 'smtp.gmail.com'
export const MAILER_PORT = process.env.MAILER_PORT || 587
export const MAILER_USERNAME = process.env.MAILER_USERNAME || 'user@gmail.com'
export const MAILER_PASSWORD = process.env.MAILER_PASSWORD || ''
export const MAILER_DEBUGGER = process.env.MAILER_DEBUGGER || 'true'

// Redis Configuration
export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
export const REDIS_PORT = process.env.REDIS_PORT || 6379
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null

const ENVS = {
  APP_NAME,
  APP_HOST,
  APP_PORT,
  APP_BASE_URL,
  NODE_ENV,
  SAVE_LOGS,
  DEFAULT_PASSWORD,
  MONGO_DB_URL,
  MONGO_DB_NAME,
  MAILER_HOST,
  MAILER_PORT,
  MAILER_USERNAME,
  MAILER_PASSWORD,
  MAILER_DEBUGGER,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
}

export default ENVS
