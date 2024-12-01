const schedules = [
  {
    queueName: 'mailertQueue',
    jobName: 'welcome',
    workerName: 'mailerWorker',
    jobData: { reportType: 'welcome' },
    cronExpression: '*/1 * * * *' // Run every day at 12:01 PM
  }
]

export default schedules
