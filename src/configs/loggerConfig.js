import winston from 'winston'
import path from 'path'
import { rootFilePath } from '../utils/index.js'
import fs from 'fs'
import 'winston-daily-rotate-file'

const directoryPath = rootFilePath('logs')
const NODE_ENV = process.env.NODE_ENV || 'development'

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: rootFilePath(`logs/app-%DATE%.${NODE_ENV}.log`),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m', // Rotate when the file size exceeds 20 MB
  maxFiles: '15d', // Keep logs for the last 14 days
  handleExceptions: true,
  handleRejections: true
})

const cleanOldDevLogs = async () => {
  if (NODE_ENV === 'development' && fs.existsSync(directoryPath)) {
    const files = await fs.promises.readdir(directoryPath)
    const now = Date.now()

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directoryPath, file)
        const stats = await fs.promises.stat(filePath)

        if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
          await fs.promises.unlink(filePath)
        }
      })
    )
  }
}

cleanOldDevLogs()

const customFormat = winston.format.printf(({ level, message }) => {
  return `${level.toUpperCase()}: ${message}`
})

const logger = winston.createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    NODE_ENV !== 'development' ? winston.format.timestamp() : winston.format.uncolorize(),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      level: NODE_ENV === 'development' ? 'debug' : 'warn',
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    dailyRotateFileTransport
  ]
})

export default logger
