import express from 'express'
const errorRouter = express.Router()

errorRouter.use((req, res, next) => {
  res.status(404)

  if (req.accepts("html")) {
    res.status(404)
  } else if (req.accepts("json")) {
    res.json({ success: false, error: "Not found" })
  } else {
    res.type("txt").send("Not found")
  }
})

export default errorRouter