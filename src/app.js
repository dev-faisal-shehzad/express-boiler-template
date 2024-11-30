import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { corsConfig } from './configs/index.js'
import './configs/consoleConfig.js'
import router from './routes/index.js'
import { i18next } from './configs/index.js'
import i18nextMiddleware from 'i18next-http-middleware';

const appConfig = express()

// i18next middleware
appConfig.use(i18nextMiddleware.handle(i18next))

// setting app global variables
// appConfig.locals.global = global

appConfig.use('/', router)

// cors configuration
appConfig.use(cors(corsConfig))

// parse requests of content-type - application/json
appConfig.use(express.json({ limit: '16kb' }))
// parse requests of content-type - application/x-www-form-urlencoded
appConfig.use(express.urlencoded({ extended: true, limit: '16kb' }))
appConfig.use(cookieParser())

// template engine and layout configuration
// appConfig.set("view engine", "ejs")
// appConfig.set("views", appFilePath("views"))
// appConfig.use(expressLayouts)
// appConfig.set("layout", "layouts/main.layout.ejs")

// static assets configuration
// appConfig.use("/public", express.static(publicFilePath("/")))
// appConfig.use("/private", express.static(appFilePath("assets")))

export { appConfig }
