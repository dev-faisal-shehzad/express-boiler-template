import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env'
})

export const mailer = nodemailer.createTransport({
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

const mailerSetup = async () => {
  mailer.verify(function (error, success) {
    if (error) {
      console.log(error)
      process.exit(1)
    } else {
      console.log(`\n\tMail server is running on port ${process.env.MAILER_PORT}\n`)
    }
  })
}

export default mailerSetup
