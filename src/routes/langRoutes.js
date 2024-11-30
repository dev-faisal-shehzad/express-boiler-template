import express from 'express'
const langRouter = express.Router()

langRouter.get('/set-language/:lng', (req, res) => {
  const { lng } = req.params
  res.cookie('i18next', lng)
  res.send(req.t('language', { lng }))
})

export default langRouter