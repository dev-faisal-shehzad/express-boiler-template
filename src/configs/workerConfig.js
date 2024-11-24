import { Worker } from 'bullmq'
import workers from './workers.js'

const initializeWorkers = () => {
  workers.forEach((worker) => {
    try {
      const activeWorker = new Worker(worker.queueName, worker.processor, worker.configuration)
  
      activeWorker.on('completed', (job) => {
        console.log(`Job ${job.id} completed successfully.`)
      })

      activeWorker.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed with error:`, err)
      })

      console.log(`Worker for queue ${worker.queueName} started successfully.`)

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
