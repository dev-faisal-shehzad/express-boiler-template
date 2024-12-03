import sendEmail from '../configs/templateConfig.js'
import { User } from '../models/index.js'
import { mongoConfig } from '../configs/index.js'
export default async (job) => {

  await mongoConfig()

  const jobName = job.name.split('-')[0]

   if(jobName == 'dailyReportJob'){
    return true
   }
   else if(jobName == 'Verification'){
    const user = await User.findById(job.data.userId)
    if (!user) return true
    const token = `${process.env.APP_BASE_URL}/api/v1/auth/verification?token=${user.verificationToken}`
    await sendEmail(user.email, 'Verification', { user: user, token: token}, 'auth/verification.html')
   }
   else if(jobName == 'Invitation'){
    const user = await User.findById(job.data.userId).populate('invitedBy')
    if (!user) return true
    const token = `${process.env.APP_BASE_URL}/api/v1/auth/invitation?token=${user.invitationToken}`
    await sendEmail(user.email, 'Invitation', { user: user, token: token}, 'auth/invitation.html')
   }

  return true
}