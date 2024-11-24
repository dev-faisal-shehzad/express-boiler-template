import multer from 'multer'
import path from 'path'
import { rootFilePath } from '../utils/index.js'

const baseDir = rootFilePath('/uploads')

const MAX_SIZE = {
  imageSize: 10 * 1024 * 1024, // 10MB
  audioSize: 5 * 1024 * 1024, // 5MB
  videoSize: 20 * 1024 * 1024, // 20MB
  pdfSize: 20 * 1024 * 1024, // 20MB
  excelSize: 20 * 1024 * 1024, // 20MB
  csvSize: 5 * 1024 * 1024 // 5MB
}

const getStorageConfig = (folderName = '') => {
  const uploadDir = path.join(baseDir, folderName)
  ensureDirectoryExists(uploadDir)

  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
  })
}

const fileFilter = (allowedMimeTypes) => (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false)
  }
}

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const imageUploader = multer({
  storage: getStorageConfig('images'),
  limits: { fileSize: MAX_SIZE.imageSize },
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/gif'])
})

const pdfUploader = multer({
  storage: getStorageConfig('pdfs'),
  limits: { fileSize: MAX_SIZE.pdfSize },
  fileFilter: fileFilter(['application/pdf'])
})

const videoUploader = multer({
  storage: getStorageConfig('videos'),
  limits: { fileSize: MAX_SIZE.videoSize },
  fileFilter: fileFilter(['video/mp4', 'video/mpeg', 'video/quicktime'])
})

const excelUploader = multer({
  storage: getStorageConfig('excels'),
  limits: { fileSize: MAX_SIZE.excelSize },
  fileFilter: fileFilter(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'])
})

const csvUploader = multer({
  storage: getStorageConfig('csvs'),
  limits: { fileSize: MAX_SIZE.csvSize },
  fileFilter: fileFilter(['text/csv', 'application/csv'])
})

const audioUploader = multer({
  storage: getStorageConfig('audios'),
  limits: { fileSize: MAX_SIZE.audioSize },
  fileFilter: fileFilter(['audio/mpeg', 'audio/wav', 'audio/ogg'])
})

export { imageUploader, pdfUploader, videoUploader, excelUploader, csvUploader, audioUploader }
