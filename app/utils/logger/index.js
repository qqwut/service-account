const Prometheus = require('prom-client')
const { addLogger, LOG_LEVEL, LOG_TYPE } = require('./logger.config')
const {
  generateSummaryLogResponse,
  generateSummaryLogOptional,
  generateDetailLogOptional,
  modelSummaryLog,
  modelDetailLog,
  modelRootLog,
  modelConsoleLog
} = require('./logger.models')

const counterHttpSuccess = new Prometheus.Gauge({
  name: 'counter_request_success',
  help: 'Status success of HTTP request',
})

const counterHttpError = new Prometheus.Gauge({
  name: 'counter_request_error',
  help: 'Status error of HTTP request',
})

const logger = {
  info: (message, req = {}) => addLogger(LOG_LEVEL.INFO, LOG_TYPE.ROOT, modelRootLog(req, message)),
  debug: (message, req = {}) => addLogger(LOG_LEVEL.DEBUG, LOG_TYPE.ROOT, modelRootLog(req, message)),
  error: (message, req = {}) => addLogger(LOG_LEVEL.ERROR, LOG_TYPE.ROOT, modelRootLog(req, message)),

  detail: {
    info: (req, data = null, message = '', optional = null, res) => {
      addLogger(LOG_LEVEL.INFO, LOG_TYPE.DETAIL, modelDetailLog(req, LOG_LEVEL.INFO, data, message, optional, res))
    },
    debug: (req, data = null, message = '', optional = null, res) => {
      addLogger(LOG_LEVEL.DEBUG, LOG_TYPE.DETAIL, modelDetailLog(req, LOG_LEVEL.DEBUG, data, message, optional, res))
    },
    error: (req, data = null, message = '', optional = null, res) => {
      addLogger(LOG_LEVEL.ERROR, LOG_TYPE.DETAIL, modelDetailLog(req, LOG_LEVEL.ERROR, data, message, optional, res))
    },
    console: (level, message) => {
      addLogger(LOG_LEVEL.CONSOLE, LOG_TYPE.DETAIL, modelConsoleLog(level, message))
    }
  },

  summary: {
    info: (req, data, optional = null) => {
      addLogger(LOG_LEVEL.INFO, LOG_TYPE.SUMMARY, modelSummaryLog(req, LOG_LEVEL.INFO, data, optional))
    },
    debug: (req, data, optional = null) => {
      addLogger(LOG_LEVEL.DEBUG, LOG_TYPE.SUMMARY, modelSummaryLog(req, LOG_LEVEL.DEBUG, data, optional))
    },
    error: (req, data, optional = null) => {
      addLogger(LOG_LEVEL.ERROR, LOG_TYPE.SUMMARY, modelSummaryLog(req, LOG_LEVEL.ERROR, data, optional))
    },
    console: (level, message) => {
      addLogger(LOG_LEVEL.CONSOLE, LOG_TYPE.SUMMARY, modelConsoleLog(level, message))
    }
  }
}

module.exports = {
  logger,
  counterHttpSuccess,
  counterHttpError,
  generateSummaryLogResponse,
  generateSummaryLogOptional,
  generateDetailLogOptional,
  modelSummaryLog,
  modelDetailLog,
  modelRootLog
}
