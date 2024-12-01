import sendEmail from '../configs/templateConfig.js'
export default async (job) => {
  const jobType = job.name.split('-')[0]

   if(jobType == 'dailyReportJob'){
    return true
   }

  // if(jobType == 'welcome'){
  //   await sendEmail('shehzadf83@gmail.com', 'welcome', { name: 'shehzadf83'}, 'email')
  // }

  return true
}