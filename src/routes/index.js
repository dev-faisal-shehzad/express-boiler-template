import express from 'express'
const router = express.Router()


console.log("\n\t----------------------------routes\n")
router.get('/', (req, res) => {
    res.send('Hello, world!')
  })

export default router