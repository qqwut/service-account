const { Router } = require('express')
const router = Router() // Load router
const CONFIG = require('./config')
const { responseError, genResponseObj } = require('./utils/response')
const { ACTIONS } = require('./config/constants').logGas
const { logger, counterHttpError, counterHttpSuccess, generateDetailLogOptional } = require('./utils/logger')
const service = 'validateHeader'

router.use(async (req, res, next) => {

  if (!req.get(CONFIG.HEADER.HEADER_APP.toLocaleLowerCase())) {
    const appName = req.get(CONFIG.HEADER.HEADER_APP) || 'unknown'
    const optionLog = generateDetailLogOptional(service, ACTIONS.REQUEST, appName, CONFIG.NODE)
    logger.detail.info(req, null, null, optionLog)
    counterHttpError.inc()
    responseError(req, res, genResponseObj(req.get('x-language'), '40100', `${CONFIG.HEADER.HEADER_APP} is empty`, undefined, CONFIG.NODE), 'validateHeader')

  } else if (!req.get(CONFIG.HEADER.HEADER_TRANSACTION_ID.toLocaleLowerCase())) {
    const appName = req.get(CONFIG.HEADER.HEADER_APP) || 'unknown'
    const optionLog = generateDetailLogOptional(service, ACTIONS.REQUEST, appName, CONFIG.NODE)
    logger.detail.info(req, null, null, optionLog)
    counterHttpError.inc()
    responseError(req, res, genResponseObj(req.get('x-language'), '40100', `${CONFIG.HEADER.HEADER_TRANSACTION_ID} is empty`, undefined, CONFIG.NODE), 'validateHeader')

  } else if (!req.get(CONFIG.HEADER.HEADER_PUBLIC_ID.toLocaleLowerCase())) {
    const appName = req.get(CONFIG.HEADER.HEADER_APP) || 'unknown'
    const optionLog = generateDetailLogOptional(service, ACTIONS.REQUEST, appName, CONFIG.NODE)
    logger.detail.info(req, null, null, optionLog)
    counterHttpError.inc()
    responseError(req, res, genResponseObj(req.get('x-language'), '40100', `${CONFIG.HEADER.HEADER_PUBLIC_ID} is empty`, undefined, CONFIG.NODE), 'validateHeader')

  } else {
    next()
  }

})

router.use('/accounts', require('./modules/accounts/accounts.routes'))

module.exports = router