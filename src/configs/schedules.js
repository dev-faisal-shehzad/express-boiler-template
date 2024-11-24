const schedules = [
  {
    queueName: 'defaultQueue',
    jobName: 'dailyReportJob',
    workerName: 'defaultWorker',
    jobData: { reportType: 'daily' },
    cronExpression: '*/2 * * * *' // Run every day at 12:01 PM
  },
  {
    queueName: 'defaultQueue',
    jobName: 'dailyReportJobs',
    workerName: 'defaultWorker',
    jobData: { reportType: 'daily' },
    cronExpression: '59 12 * * *' // Run every day at 9 AM
  }
]

export default schedules
