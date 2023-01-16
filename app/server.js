const CONFIG = require('./config') // Load config (environment)
const express = require('express') // Load express
const mongoose = require('mongoose') // Load mongoose
const cors = require('cors') // Load cors
const hbs = require('hbs')
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const { responseError, genResponseObj } = require('./utils/response')
const db = require('./db/db')
const routes = require('./route')
const swaggerDoc = require('./swagger')
const { ACTIONS } = require('./config/constants').logGas
const { logger, counterHttpError, generateDetailLogOptional } = require('./utils/logger')

const app = express(db)

require('./utils/core/debug.event.emitter')

app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerDoc))

app.set('view engine', 'hbs')
app.enable('trust proxy')

// configure app 
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000,
}))

app.use(express.json({
  limit: '50mb',
}))

// Helmet
app.use(helmet())

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
  }
}))

app.use(helmet.noCache())

// Enable CORS on Express server instance
app.use(cors({
  credentials: true,
  origin: true,
  methods: 'GET,POST,PATCH,DELETE',
}))

app.use((err, req, res, next) => {
  const connectionStatus = mongoose.connection.readyState
  if (connectionStatus === 0) {
    mongoose.connect(CONFIG.MONGO.CONNECT, {
      poolSize: Number(CONFIG.MONGO.OPTION.POOL_SIZE),
      bufferMaxEntries: Number(CONFIG.MONGO.OPTION.BUFFER_MAX_ENTRIES),
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: CONFIG.MONGO.OPTION.AUTH,
      serverSelectionTimeoutMS: CONFIG.MONGO.OPTION.TIMEOUT
    }, (err) => {
      if (err) {
        responseError(req, res, genResponseObj(req.get('x-language'), '50002', err, undefined, CONFIG.NODE), 'connect DB')
      } else {
        next()
      }
    })

  } else {
    next()
  }
})

// Configure app routes
app.use('/party-service/api/v1/accounts-management', routes)

// Access Denied
app.use((req, res) => {
  const appName = req.get(CONFIG.HEADER.HEADER_APP) || 'unknown'
  const service = 'accessDenied'
  const optionLog = generateDetailLogOptional(service, ACTIONS.REQUEST, appName, CONFIG.NODE)
  logger.detail.info(req, null, null, optionLog)
  const data = genResponseObj(req.get('x-language'), '40100', 'Access Denied', undefined, CONFIG.NODE)
  counterHttpError.inc()
  responseError(req, res, data, service)
})

// port
app.listen(CONFIG.PORT, () => {
  console.log(`Listening on port [ ${CONFIG.PORT} ]`)
})