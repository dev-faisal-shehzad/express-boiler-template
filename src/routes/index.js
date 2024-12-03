import express from 'express'
const router = express.Router()

import errorRouter from './ErrorRoutes.js'
import LangRouter from './LangRoutes.js'

router.get('/', (req, res) => { res.send(req.t('helloWorld')) })
router.use('/lang', LangRouter)
// router.use('*', errorRouter)

export default router