const { Router } = require('express')
const router = Router() // Load router
const { logger, counterHttpError, counterHttpSuccess, generateDetailLogOptional } = require('../../utils/logger')
const controller = require('./accounts.controller')
const { response, responseError, genResponseObj } = require('../../utils/response')
const { validate } = require('./../../utils/validators')
const { accountsQuerySchema, accountsBodySchema, accountsPathSchema, accountsBodyUpdateSchema } = require('./accounts.interface')
const CONFIG = require('../../config')
const { ACTIONS } = require('../../config/constants').logGas

router.get('', async (req, res) => {
  const now = Date.now()
  const service = 'getAccountList'
  const appName = req.get('X-App')
  try {
    const optionLog = generateDetailLogOptional(service, ACTIONS.REQUEST, appName, CONFIG.NODE)
    logger.detail.info(req, null, null, optionLog)
    await validate.query(accountsQuerySchema, req)
    const result = await controller.accountList(req)
    if (result.total === 0) {
      throw genResponseObj(req.get('x-language'), '40400', 'account not found.', undefined, CONFIG.NODE)
    }
    counterHttpSuccess.inc()
    return response(req, res, result, service, now)
  } catch (e) {
    counterHttpError.inc()
    return responseError(req, res, e, service, now)
  }
}
)

router.get('/:_id', async (req, res) => {
  const now = Date.now()
  const service = 'getAccountDetail'
  const appName = req.get('X-App')
  try {
    const optionLog = generateDetailLogOptional(service, ACTIONS.REQUEST, appName, CONFIG.NODE)
    logger.detail.info(req, null, null, optionLog)
    await validate.params(accountsPathSchema, req)
    const result = await controller.accountDetail(req)
    if (result && result._doc) {
      counterHttpSuccess.inc()
      return response(req, res, result, service, now)
    } else {
      const resp = genResponseObj(req.get('x-language'), '40400', 'account not found.', undefined, CONFIG.NODE)
      logger.error(resp)
      counterHttpError.inc()
      return responseError(req, res, resp, service, now)
    }
  } catch (e) {
    counterHttpError.inc()
    return responseError(req, res, e, service, now)
  }
})

router.post('', async (req, res) => {
  const now = Date.now()
  const service = 'insertAccount'
  const appName = req.get('X-App')
  try {
    const optionLog = generateDetailLogOptional(service, ACTIONS.REQUEST, appName, CONFIG.NODE)
    logger.detail.info(req, null, null, optionLog)
    await validate.body(accountsBodySchema, req)
    const result = await controller.accountInsert(req)
    counterHttpSuccess.inc()
    return response(req, res, result, service, now)
  } catch (e) {
    counterHttpError.inc()
    return responseError(req, res, e, service, now)
  }
})

router.patch('/:_id', async (req, res) => {
  const now = Date.now()
  const service = 'updateAccount'
  const appName = req.get('X-App')
  try {
    const optionLog = generateDetailLogOptional(service, ACTIONS.REQUEST, appName, CONFIG.NODE)
    logger.detail.info(req, null, null, optionLog)
    await validate.params(accountsPathSchema, req)
    await validate.body(accountsBodyUpdateSchema, req)
    const result = await controller.accountUpdate(req)
    counterHttpSuccess.inc()
    return response(req, res, result, service, now)
  } catch (e) {
    counterHttpError.inc()
    return responseError(req, res, e, service, now)
  }
})

module.exports = router
