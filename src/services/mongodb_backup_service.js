import { exec } from 'child_process'
import path from 'path'
import { rootFilePath } from '../utils/index.js'

class MongoDBBackupService {
  constructor() {
    this.dbName = process.env.MONGO_DB_NAME
    this.mongoUri = `${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_NAME}`
    this.currentDate = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '')
    this.backupFilePath = path.join(rootFilePath('temp/backups'), `${this.dbName}_backup_${this.currentDate}.gz`) 
  }

  async backupDatabase() {
    return new Promise((resolve, reject) => {
      const command = `mongodump --uri="${this.mongoUri}" --archive="${this.backupFilePath}" --gzip`

      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error executing mongodump: ${error.message}`)
        } else if (stderr) {
          reject(`Error from mongodump: ${stderr}`)
        } else {
          resolve(`Backup completed successfully for ${this.dbName}: ${stdout}`)
        }
      })
    })
  }
}

export default MongoDBBackupService
