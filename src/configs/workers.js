import redisConfiq from './redisConfig'

const defaultWorkerOptions = {
  connection: redisConfiq,
  concurrency: 50, // Process up to 50 jobs concurrently
  settings: {
    removeOnComplete: true,
    removeOnFail: { count: 5000, age: 24 * 3600 } // Keep failed jobs for up to 24 hours
  },
  useWorkerThreads: true // Enabling worker threads for better parallel job processing
}
const workerList = [
  {
    queueName: 'defaultQueue',
    processor: './index.js',
    configuration: defaultWorkerOptions
  },
  {
    queueName: 'mailertQueue',
    processor: './mailerWorker.js',
    configuration: defaultWorkerOptions
  }
]

export default workerList