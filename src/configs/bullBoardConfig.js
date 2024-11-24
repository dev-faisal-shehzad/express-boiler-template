import basicAuth from 'express-basic-auth';
import { bullMQQueues } from './bullMQConfig.js'
import { createBullBoard } from "@bull-board/api"
import { ExpressAdapter } from "@bull-board/express"
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js"

const serverAdapter = new ExpressAdapter();

const setupBullBoard = async (appConfig) => {
    const bullMQAdapterQueues = Object.values(bullMQQueues).map(queue => new BullMQAdapter(queue));

    createBullBoard({
      queues: bullMQAdapterQueues,
      serverAdapter: serverAdapter
    })
  
    serverAdapter.setBasePath("/bullmq")
  
    appConfig.use('/bullmq', basicAuth({
      users: { 'admin': 'admin' },
      challenge: true,
      unauthorizedResponse: 'Unauthorized'
    }))

    appConfig.use('/bullmq', serverAdapter.getRouter())
  }


export default setupBullBoard