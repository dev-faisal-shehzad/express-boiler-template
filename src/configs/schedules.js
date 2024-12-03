const schedules = [
  {
    queueName: 'mailertQueue',
    jobName: 'welcome',
    workerName: 'mailerWorker',
    jobData: { reportType: 'welcome' },
    cronExpression: '*/3 * * * *', // repeat after every minute 
  }
]

export default schedules