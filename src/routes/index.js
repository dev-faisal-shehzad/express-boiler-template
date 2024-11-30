import express from 'express'
const router = express.Router()

import errorRouter from './ErrorRouter.js'
import LangRouter from './LangRouter.js'

router.get('/', (req, res) => { res.send(req.t('helloWorld')) })
router.use('/lang', LangRouter)
router.use('*', errorRouter)

export default router