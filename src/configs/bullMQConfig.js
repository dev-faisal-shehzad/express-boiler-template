import { Queue, JobScheduler } from 'bullmq'
import queues from './queues.js'
import schedules from './schedules.js'
import redisConfig from './redisConfig.js'

export const bullMQQueues = {}

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

export const initializeBullMQQueues = () => {
  queues.forEach((queue) => {
    try {
      bullMQQueues[queue.queueName] = new Queue(queue.queueName, {
        connection: redisConfig,
        limiter: queue.limiter,
        defaultJobOptions: queue.defaultJobOptions
      })
      console.log(`Queue initialized: ${queue.queueName}`);
    } catch (error) {
      console.error('Error during queue initialization : ', error.message, error.stack);
    }

    if (queue.scheduler) {
      try {
        new JobScheduler(queue.queueName, { connection: redisConfig })
      }
      catch (error) {
        console.error('Error during scheduler initialization : ', error.message, error.stack);
      }
    }
  })

  
}

export const addJobToQueue = async (
  jobName,
  jobData,
  cronExpression = null,
  jobOptions = {},
  queueName = 'defaultQueue'
) => {
  if (!bullMQQueues[queueName]) {
    throw new Error(`Queue "${queueName}" is not initialized`)
  }

  const bullMQQueue = bullMQQueues[queueName]
  let finalOptions = { ...defaultJobOptions, ...jobOptions }
  if (cronExpression) {
    finalOptions = { ...finalOptions, repeat: { cron: cronExpression } }
  }

  try {
    await bullMQQueue.add(jobName, jobData, finalOptions)
  } catch (error) {
    console.error('Error during job enqueuing :', error.message, error.stack);
  }
}

export const initializeScheduledJobs = () => {
  schedules.forEach((schedule) => {
    addJobToQueue(schedule.jobName + '-' + schedule.workerName, schedule.jobData, schedule.cronExpression, {}, schedule.queueName)
  })
}
