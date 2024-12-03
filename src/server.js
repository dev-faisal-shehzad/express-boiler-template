import dotenv from 'dotenv'

dotenv.config({
  path: './.env'
})

import { appConfig } from './app.js'
import {
  mongoConfig,
  redisConfiq,
  mailerSetup,
  initializeBullMQQueues,
  initializeWorkers,
  initializeScheduledJobs,
  setupBullBoard
} from './configs/index.js'
import { User } from './models/index.js'

const startServer = async (port) => {
  try {
    await redisConfiq.connect()
    console.log('\n\tConnected to Redis')

    await initializeBullMQQueues()
    console.log('Queues initialized successfully.')

    await initializeWorkers()
    console.log('Workers initialized successfully.')

    await initializeScheduledJobs()

    await setupBullBoard(appConfig)

    await mailerSetup()

    // global.job.runAt('mailertQueue', 'mailerWorker', 'runAt', { name: 'testRunAt'}, new Date(Date.now() + 10 * 60 * 1000))

  //   const createUser = async () => {
  //     await User.deleteMany({})
    
  //     const newUser = new User({
  //         firstName: 'Jane',
  //         lastName: 'Doe',
  //         email: 'shehzadf83@gmail.com',
  //         password: 'Password123!',
  //         gender: 'Female'
  //     })
  //     await newUser.save() 

  //     const newInviteUser = new User({
  //       firstName: 'Jane',
  //       lastName: 'Doe',
  //       email: 'shehzadf831@gmail.com',
  //       password: 'Password123!',
  //       gender: 'Female',
  //       invitedBy: newUser._id,
  //     })
  //     await newInviteUser.save() 
  // }
  
  //   await createUser()


  } catch (err) {
    console.error('\n\tError during strting:', err.message)
    process.exit(1)
  }

  const server = appConfig.listen(port, () => {
    console.log(`\n\tServer running at http://${process.env.APP_HOST}:${port}\n`)
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
