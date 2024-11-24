import dotenv from 'dotenv'

dotenv.config({
  path: './.env'
})

import { appConfig } from './app.js'
import { mongoConfig, redisConfiq, mailer, initializeQueues, initializeWorkers, initializeScheduledJobs } from './configs/index.js'
import { addJobToQueue } from './configs/index.js'

const startServer = async (port) => {
  try {
    await redisConfiq.connect();
    console.log('\n\tConnected to Redis');

    await initializeQueues();
    console.log('Queues initialized successfully.');

    await initializeWorkers();
    console.log('Workers initialized successfully.');

    await addJobToQueue('msg-mailer', { type: 'haha' });
    console.log('Job added to queue successfully.');

    await initializeScheduledJobs()

    mailer.verify(function (error, success) {
      if (error) {
        console.log(error)
        process.exit(1)
      } else {
        console.log(`\n\tMail server is running on port ${process.env.MAILER_PORT}\n`)
      }
    })
  }
  catch (err) {
    console.error('\n\tError during strting:', err.message)
    process.exit(1)
  }

  const server = appConfig.listen(port, () => {
    console.log(`\n\tServer running at http://${process.env.HOST}:${port}\n`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`\n\tPort ${port} is already in use, trying port ${port + 1}`)
      startServer(port + 1)
    } else {
      console.error('\n\tServer error: ', err)
    }
  })
}

mongoConfig()
  .then(() => {
    startServer(parseInt(process.env.PORT) || 3000)
  })
  .catch((err) => {
    console.error('\n\tDB connection failed due to ', err)
    process.exit(1)
  })
