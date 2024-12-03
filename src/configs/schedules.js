const schedules = [
  {
    queueName: 'defaultQueue',
    jobName: 'MongoDB Backup',
    workerName: 'defaultWorker',
    jobData: {},
    cronExpression: '59 23 * * *',
    time: 'Repeat at 11:59 PM every day'
  }
]

export default schedules