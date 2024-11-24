import { Worker } from 'bullmq'
import workerList from './workers.js'

const initializeWorkers = () => {
  workerList.forEach((workerConfig) => {
    try {
      const worker = new Worker(workerConfig.queueName, workerConfig.processor, workerConfig.configuration)
  
      worker.on('completed', (job) => {
        console.log(`Job ${job.id} completed successfully.`)
      })

      worker.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed with error:`, err)
      })

      console.log(`Worker for queue ${workerConfig.queueName} started successfully.`)

      process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection:', err)
      })
      process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err)
      })
    } catch (error) {
      console.error('Error during worker initialization :', error.message, error.stack);
    }
  })
}

export default initializeWorkers
