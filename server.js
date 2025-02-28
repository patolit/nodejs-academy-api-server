require('dotenv').config()
require('./db/')
const express = require('express')
const serverLog = require('./serverLog')
const addDate = require('./middleware/addDate')
const addResponseHeader = require('./middleware/addResponseHeader')
const usersRouter = require('./routers/users-router')
const shiftRouter = require('./routers/shift-router')
const soldierRouter = require('./routers/soldier-router')

const app = express()
const port = process.env.PORT || 8080
app.use(serverLog)
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(serverLog, addDate, addResponseHeader)
app.use('/users', usersRouter)
app.use('/soldier', soldierRouter)
app.use('/shift', shiftRouter)

app.get('/', (req, res, next) => {
  res.status(200).json({
    server: '1.0.0',
    name: 'nodejs-api-server',
  })
})

app
  .get('/query', (req, res, next) => {
    console.log(req.query)
    const { test } = req.query
    // do what we need with the param
    res.status(200).json({
      queryParams: req.query,
    })
  })
  .get('/query/test/:number', (req, res, next) => {
    console.log(req.params)
    const { test } = req.query
    // do what we need with the param
    res.status('200').json({
      params: req.params,
    })
  })
  .post('/', (req, res, next) => {
    console.log(req.body)
    const { data } = req.body
    res.status(200).json({
      received: data,
    })
  })

app.use(async (err, req, res, next) => {
  if (res && res.headersSent) {
    return next(err)
  }

  if (!err.statusCode) {
    err.statusCode = 500
  }
  return res.status(err.statusCode).json({ error: err.message })
})

process.on('uncaughtException', (err) => {
  console.log('There was an uncaught error', err)
  res.status(err.statusCode).jason({ error: err.message })
  process.exit(1) //mandatory (as per the Node.js docs)
})

const server = app.listen(port, () => console.log(` 🚀 server started on port ${port}`))
module.exports = { app, server }
