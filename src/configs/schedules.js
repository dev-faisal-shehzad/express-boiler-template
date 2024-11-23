import workers from '../workers'

const scheduleList = [
  {
    queueName: 'mailerQueue',
    jobName: 'dailyReportJob',
    workerName: 'defaultWorker',
    jobData: { reportType: 'daily' },
    cronExpression: '0 8 * * *' // Run every day at 8 AM
  },
  {
    queueName: 'mailerQueue',
    jobName: 'dailyReportJob',
    workerName: 'mailerWorker',
    jobData: { reportType: 'daily' },
    cronExpression: '0 9 * * *' // Run every day at 9 AM
  }
]

export default scheduleList
