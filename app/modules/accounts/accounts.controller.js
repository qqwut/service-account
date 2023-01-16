const accountService = require('./accounts.services')
const { logger } = require('../../utils/logger')
const { genResponseObj, genResObjList } = require('../../utils/response')
const CONFIG = require('../../config')
const { LEVEL } = require('../../config/constants').logGas
const { generateLinks } = require('./../../utils')

exports.accountList = async (req) => {
  const result = await accountService.getAccountsList(req)
  result.links = generateLinks(req.originalUrl, result.meta)
  return result

}

exports.accountDetail = async (req) => {
  const accounts = await accountService.accountDetail(req)
  return accounts
}

exports.accountInsert = async (req) => {
  req.body.createdDate = new Date()
  const accountInsert = await accountService.accountInsert(req)
  return accountInsert
}

exports.accountUpdate = async (req) => {
  req.body.updatedDate = new Date()
  const result = accountService.accountUpdate(req)
  return result
}