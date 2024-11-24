const defaultJobOptions = {
  attempts: 5, // Retry up to 5 times if a job fails
  priority: 1,
  backoff: 5000, // Wait 5 seconds between retries
  removeOnComplete: {
    age: 3600, // keep up to 1 hour
    count: 1000 // keep up to 1000 jobs
  },
  removeOnFail: false
}

const defaultLimiter = {
  max: 100, // Max number of jobs
  duration: 10000 // Per 10 seconds
}

const queues = [
  {
    queueName: 'defaultQueue',
    limiter: defaultLimiter,
    scheduler: true,
    defaultJobOptions: defaultJobOptions
  },
  {
    queueName: 'mailertQueue',
    limiter: defaultLimiter,
    scheduler: true,
    defaultJobOptions: defaultJobOptions
  }
]

export default queues
