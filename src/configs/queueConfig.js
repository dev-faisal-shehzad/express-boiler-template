import { Queue } from 'bullmq'
import queueList from './queues.js'

const queues = {}
export const initializeQueues = () => {
  queueList.forEach((queueConfig) => {
    queues[queueConfig.name] = new Queue(queueConfig.queueName, {
      connection: redisConfig,
      limiter: queueConfig.limiter,
      defaultJobOptions: queueConfig.defaultJobOptions,
    })
  })
}

export const addJobToQueue = async (jobName, jobData, cronExpression= null, jobOptions = {}, queueName = 'defaultQueue', workerName = 'defaultWorker') => {
  if (!queues[queueName]) { throw new Error(`Queue "${queueName}" is not initialized`) }

  const queue = queues[queueName];
  const finalOptions = { ...defaultJobOptions, ...jobOptions }
  if (cronExpression) { finalOptions = { ...finalOptions, repeat: { cron: cronExpression } }}

  await queue.add(workerName + '-' + jobName, jobData, finalOptions)
}