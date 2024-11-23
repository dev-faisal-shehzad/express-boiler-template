import winston from 'winston'
import path from 'path'
import { rootFilePath } from '../utils/index.js'
import fs from 'fs'
import 'winston-daily-rotate-file'

const directoryPath = rootFilePath('logs')
const NODE_ENV = process.env.NODE_ENV || 'development'

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: rootFilePath('logs/app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m', // Rotate when the file size exceeds 20 MB
  maxFiles: '15d', // Keep logs for the last 14 days
  handleExceptions: true,
  handleRejections: true
})

const cleanDevLogs = async () => {
  if (NODE_ENV === 'development' && fs.existsSync(directoryPath)) {
    const files = await fs.promises.readdir(directoryPath)
    await Promise.all(
      files.filter((file) => file.includes('dev')).map((file) => fs.promises.unlink(path.join(directoryPath, file)))
    )
  }
}
cleanDevLogs()

const customFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level.toUpperCase()}: ${message} ${stack ? `\nStack: ${stack}` : ''}`
})

const logger = winston.createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: [
    new winston.transports.Console({
      level: NODE_ENV === 'development' ? 'debug' : 'warn',
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    dailyRotateFileTransport
  ]
})

export default logger
