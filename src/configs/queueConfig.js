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
    try {
      queues[queueConfig.queueName] = new Queue(queueConfig.queueName, {
        connection: redisConfig,
        limiter: queueConfig.limiter,
        defaultJobOptions: queueConfig.defaultJobOptions
      })
    } catch (error) {
      console.error('Error during queue initialization : ', error.message, error.stack);
    }

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
  queueName = 'defaultQueue'
) => {
  if (!queues[queueName]) {
    throw new Error(`Queue "${queueName}" is not initialized`)
  }

  const queue = queues[queueName]
  const finalOptions = { ...defaultJobOptions, ...jobOptions }
  if (cronExpression) {
    finalOptions = { ...finalOptions, repeat: { cron: cronExpression } }
  }

  try {
    await queue.add(jobName, jobData, finalOptions)
  } catch (error) {
    console.error('Error during job enqueuing :', error.message, error.stack);
  }
}

export const initializeScheduledJobs = () => {
  scheduleList.forEach((schedule) => {
    addJobToQueue(schedule.jobName + '-' + schedule.workerName, schedule.jobData, schedule.cronExpression, {}, schedule.queueName)
  })
}
