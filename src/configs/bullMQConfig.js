import { Queue, JobScheduler } from 'bullmq'
import queues from './queues.js'
import schedules from './schedules.js'
import redisConfig from './redisConfig.js'

export const bullMQQueues = {}

const defaultJobOptions = {
  attempts: 0,
  priority: 1,
  backoff: 9000,
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
      console.log(`Queue initialized: ${queue.queueName}`)
    } catch (error) {
      console.error('Error during queue initialization : ', error.message, error.stack)
    }

    if (queue.scheduler) {
      try {
        new JobScheduler(queue.queueName, { connection: redisConfig })
      } catch (error) {
        console.error('Error during scheduler initialization : ', error.message, error.stack)
      }
    }
  })
}

const runNow = async (queueName, WorkerName, jobName, jobData) => {
  if (!bullMQQueues[queueName]) throw new Error(`Queue "${queueName}" is not initialized.`)

  await addJobToQueue(`${jobName}-${WorkerName}`, jobData, null, {}, queueName)
}

const runLater = async (queueName, WorkerName, jobName, jobData) => {
  if (!bullMQQueues[queueName]) throw new Error(`Queue "${queueName}" is not initialized.`)

  await addJobToQueue(`${jobName}-${WorkerName}`, jobData, null, { delay: 100000  }, queueName)
}

const runAt = async (queueName, WorkerName, jobName, jobData, dateTime) => {
  if (!bullMQQueues[queueName]) throw new Error(`Queue "${queueName}" is not initialized.`)

    const delay = new Date(dateTime).getTime() - Date.now()
    if (delay < 0) {
      throw new Error('Specified time is in the past.')
    }

  await addJobToQueue(`${jobName}-${WorkerName}`, jobData, null, { delay: delay  }, queueName)
}


export const jobMethods = { runNow, runLater, runAt }

export const addJobToQueue = async (jobName, jobData, cronExpression = null, jobOptions = {}, queueName = 'defaultQueue') => {
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
    console.error('Error during job enqueuing :', error.message, error.stack)
  }
}

export const initializeScheduledJobs = () => {
  schedules.forEach((schedule) => {
    addJobToQueue(schedule.jobName + '-' + schedule.workerName, schedule.jobData, schedule.cronExpression, {}, schedule.queueName)
  })
}
