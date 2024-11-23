import { Worker } from 'bullmq'
import workerList from './workers.js'

const initializeWorkers = () => {
  workerList.forEach((workerConfig) => {
    const worker = new Worker(workerConfig.queueName, workerConfig.processor, workerConfig.configuration)

    worker.on('completed', (job) => { console.log(`Job ${job.id} completed successfully.`)})
    worker.on('failed', (job, err) => { console.error(`Job ${job.id} failed with error:`, err)})
  })
}

export default initializeWorkers