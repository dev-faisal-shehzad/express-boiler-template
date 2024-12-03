import sendEmail from '../configs/templateConfig.js'
import { mongoConfig } from '../configs/index.js'

export default async (job) => {
  await mongoConfig()

  const jobName = job.name.split('-')[0]

  if(jobName === 'Server Start'){
    await sendEmail(process.env.ADMIN_MAIL, 'Server Start', {}, 'reports/server_start.html')
  }

  return true
}
