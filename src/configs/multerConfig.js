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

const ALLOWED_FILETYPES = {
  image: /\.(jpg|jpeg|png|gif)$/,
  pdf: /\.pdf$/,
  video: /\.(mp4|avi|mkv)$/,
  excel: /\.(xlsx|xls)$/,
  csv: /\.csv$/,
  audio: /\.(mp3|wav|ogg)$/
}

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const getStorageConfig = (folderName = '') => {
  const uploadDir = path.join(baseDir, folderName)
  ensureDirectoryExists(uploadDir)

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
  })
}

const fileFilter = (allowedMimeTypes) => (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase()
  const isValid = allowedMimeTypes.test(extname)

  if (isValid) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false)
  }
}

const imageUploader = multer({
  storage: getStorageConfig('images'),
  limits: { fileSize: MAX_SIZE.imageSize },
  fileFilter: fileFilter(ALLOWED_FILETYPES.image)
})

const pdfUploader = multer({
  storage: getStorageConfig('pdfs'),
  limits: { fileSize: MAX_SIZE.pdfSize },
  fileFilter: fileFilter(ALLOWED_FILETYPES.pdf)
})

const videoUploader = multer({
  storage: getStorageConfig('videos'),
  limits: { fileSize: MAX_SIZE.videoSize },
  fileFilter: fileFilter(ALLOWED_FILETYPES.video)
})

const excelUploader = multer({
  storage: getStorageConfig('excels'),
  limits: { fileSize: MAX_SIZE.excelSize },
  fileFilter: fileFilter(ALLOWED_FILETYPES.excel)
})

const csvUploader = multer({
  storage: getStorageConfig('csvs'),
  limits: { fileSize: MAX_SIZE.csvSize },
  fileFilter: fileFilter(ALLOWED_FILETYPES.csv)
})

const audioUploader = multer({
  storage: getStorageConfig('audios'),
  limits: { fileSize: MAX_SIZE.audioSize },
  fileFilter: fileFilter(ALLOWED_FILETYPES.audio)
})

export { imageUploader, pdfUploader, videoUploader, excelUploader, csvUploader, audioUploader }
