const schedules = [
  {
    queueName: 'defaultQueue',
    jobName: 'MongoDB Backup',
    workerName: 'defaultWorker',
    jobData: {},
    cronExpression: '0 23 * * *',
    time: 'Repeat at 11:00 PM every day'
  }
]

export default schedules