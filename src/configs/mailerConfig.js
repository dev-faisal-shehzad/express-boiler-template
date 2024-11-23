import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env'
})

if (!process.env.MAILER_HOST || !process.env.MAILER_PORT || !process.env.MAILER_USERNAME || !process.env.MAILER_PASSWORD) {
  throw new Error('\n\tMissing one or more required environment variables for mailer : HOST, PORT, USERNAME, PASSWORD')
}

const mailer = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: parseInt(process.env.MAILER_PORT, 10),
  secure: false,
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD
  },
  debug: true,
  logger: true,
  tls: { rejectUnauthorized: false }
})

export default mailer
