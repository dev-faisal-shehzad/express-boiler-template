import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export const filePath = (relativePath) => path.join(__dirname, relativePath)
export const publicFilePath = (relativePath) => path.join(__dirname, `../../public/${relativePath}`)
export const appFilePath = (relativePath) => path.join(__dirname, `../${relativePath}`)
export const rootFilePath = (relativePath) => path.join(__dirname, `../../${relativePath}`)
