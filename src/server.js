import dotenv from 'dotenv'

dotenv.config({
  path: './.env'
})

import { appConfig } from './app.js'
import { mongoConfig, redisConfiq, mailer, initializeQueues } from './configs/index.js'

const startServer = (port) => {
  const server = appConfig.listen(port, () => {
    console.log(`\n\tServer running at http://${process.env.HOST}:${port}\n`)

    mailer.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log(`\n\tMail server is running on port ${process.env.MAILER_PORT}\n`)
      }
      redisConfiq
        .connect()
        .then(() => {
          console.log('\n\tConnected to Redis')
          initializeQueues()
        })
        .catch((err) => {
          console.error('\n\tFailed to connect to Redis:', err)
          process.exit(1)
        })
    })
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
