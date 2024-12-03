import sendEmail from '../configs/templateConfig.js'
import { MongoDBBackupService } from '../services/index.js'
import { mongoConfig } from '../configs/index.js'

export default async (job) => {
  try {
    await mongoConfig()
  
    const jobName = job.name.split('-')[0]
  
    if(jobName === 'Server Start'){
      await sendEmail(process.env.ADMIN_MAIL, 'Server Start', {}, 'reports/server_start.html')
    }
    else if (jobName === 'MongoDB Backup'){
      const backupService = new MongoDBBackupService()
      await backupService.backupDatabase()
    }
  
    return true
  }
  catch (err) {
    console.error('Error processing job:', err.message)
    return false
  }
}
