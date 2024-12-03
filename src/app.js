import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { corsConfig } from './configs/index.js'
import './configs/consoleConfig.js'
import router from './routes/index.js'
import { i18next, jobMethods } from './configs/index.js'
import i18nextMiddleware from 'i18next-http-middleware'
import { authenticateUser } from './middlewares/index.js'

const appConfig = express()

// i18next middleware
appConfig.use(i18nextMiddleware.handle(i18next))

// setting app global variables
global.job = jobMethods

// cors configuration
appConfig.use(cors(corsConfig))

// parse requests of content-type - application/json
appConfig.use(express.json({ limit: '16kb' }))
// parse requests of content-type - application/x-www-form-urlencoded
appConfig.use(express.urlencoded({ extended: true, limit: '16kb' }))
appConfig.use(cookieParser())

appConfig.use('/', authenticateUser, router)

export { appConfig }
