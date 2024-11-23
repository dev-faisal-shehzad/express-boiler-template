import pkg from 'bullmq'
import queueList from './queues.js'
import scheduleList from './schedules.js'
import redisConfig from './redisConfig.js'

const { Queue, QueueScheduler } = pkg

const queues = {}

const defaultJobOptions = {
  attempts: 5,
  priority: 1,
  backoff: 5000,
  removeOnComplete: {
    age: 3600,
    count: 1000
  },
  removeOnFail: false
}
export const initializeQueues = () => {
  queueList.forEach((queueConfig) => {
    queues[queueConfig.name] = new Queue(queueConfig.queueName, {
      connection: redisConfig,
      limiter: queueConfig.limiter,
      defaultJobOptions: queueConfig.defaultJobOptions
    })

    // if (queueConfig.scheduler) {
    //   new QueueScheduler(queueConfig.queueName, { connection: redisConfig })
    // }
  })
}

export const addJobToQueue = async (
  jobName,
  jobData,
  cronExpression = null,
  jobOptions = {},
  queueName = 'defaultQueue',
  workerName = 'defaultWorker'
) => {
  if (!queues[queueName]) {
    throw new Error(`Queue "${queueName}" is not initialized`)
  }

  const queue = queues[queueName]
  const finalOptions = { ...defaultJobOptions, ...jobOptions }
  if (cronExpression) {
    finalOptions = { ...finalOptions, repeat: { cron: cronExpression } }
  }

  await queue.add(workerName + '-' + jobName, jobData, finalOptions)
}

export const initializeScheduledJobs = () => {
  scheduleList.forEach((schedule) => {
    addJobToQueue(schedule.jobName, schedule.jobData, schedule.cronExpression, {}, schedule.queueName, schedule.workerName)
  })
}
