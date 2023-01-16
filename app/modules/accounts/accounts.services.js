const accountsDb = require('../../db/accounts.db')

exports.getAccountsList = async (req) => {

  const option = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sort: req.query.sortBy || 'name',
    order: req.query.order || 'desc'
  }

  const parameter = {}
  if (req.query.companyId instanceof Array) {
    if (req.query.companyId.length > 0) {
      parameter.companyId = { '$in': req.query.companyId }
    }
  } else {
    if (req.query.companyId)
      parameter.companyId = req.query.companyId
  }

  if (req.query.name) parameter.name = { '$regex': req.query.name, '$options': 'i' }
  if (req.query.mcc) parameter.mcc = req.query.mcc
  if (req.query.mnc) parameter.mnc = req.query.mnc
  if (req.query._id) parameter._id = req.query._id
  if (req.query.companyId) parameter.companyId = req.query.companyId

  return await accountsDb.getAccounts(parameter, option)
}

exports.accountDetail = async (req) => {
  return await accountsDb.accountDetail(req.params._id)
}

exports.accountInsert = async (req) => {
  return await accountsDb.accountInsert(req.body)
}

exports.accountUpdate = async (req) => {
  return await accountsDb.accountUpdate({ _id: req.params._id }, req.body)
}