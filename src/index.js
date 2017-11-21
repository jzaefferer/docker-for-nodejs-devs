import express from 'express'
import logger from 'winston'

import './logging'
import pets from './pets-route'
import serverPackage from '../package.json'

const app = express()

app.use(express.json())

app.use('/v1/pets', pets)

// basic information - also used as a health check
app.get('/v1/info', (req, res) => {
  res.json({
    status: 'success',
    version: serverPackage.version,
  })
})

// CatchAll (handle invalid paths)
app.use('/', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `There is no ${req.method} ${req.path} endpoint`,
  })
})

// init error handler after other routes, to be able to log all errors
// next argument has to be present for Express to run this >:-(
app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = error.status || 500

  // Don't log 401/404 errors
  if (status !== 401 && status !== 404) {
    logger.error(`${error.message} ${error.reason}`, {
      component: 'express#serve-error',
      error,
    })
  }

  res.status(status).json({
    status: 'error',
    message: error.message,
    reason: error.reason,
  })
})

const port = process.env.PORT

app.listen(port, () => {
  logger.info(`Express started, listening at http://localhost:${port}`, {
    component: 'express#start',
  })
})

