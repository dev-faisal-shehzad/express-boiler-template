import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { corsConfig } from "./configs/index.js"

const appConfig = express()


// cors configuration
appConfig.use(cors(corsConfig))

// parse requests of content-type - application/json
appConfig.use(express.json({ limit: "16kb" }))
// parse requests of content-type - application/x-www-form-urlencoded
appConfig.use(express.urlencoded({ extended: true, limit: "16kb" }))
appConfig.use(cookieParser())


export { appConfig }