const accountsModels = require('../models/accounts.models')
const CONFIG = require('./../config')

module.exports.getAccounts = async (searchCriteria, options = null) => {
  const response = {
    links: {},
    meta: {},
    total: 0,
    results: []
  }
  let result

  if (options) {
    const limits = parseInt(options.limit, 10)
    const skip = parseInt(options.limit, 10) * (parseInt(options.page, 10) - 1)
    response.results = await accountsModels.find(searchCriteria).sort({ [options.sort]: options.order === 'asc' ? 1 : -1 }).skip(skip).limit(limits)
    const total = await accountsModels.countDocuments(searchCriteria)
    response.links.prev = options.page - 1
    if (options.page === 1) response.links.prev = ''
    response.links.next = + options.page + 1
    response.meta.currentPage = + options.page
    response.meta.totalPages = Math.ceil(total / options.limit)
    response.meta.limit = Number(options.limit || CONFIG.PAGINATION.LIMIT)
    response.total = total
  } else {
    result = await accountsModels.find({})
    response.results = result
  }

  return response
}

module.exports.accountDetail = async (id) => {
  return await accountsModels.findById(id)
}

module.exports.accountInsert = async (data) => {
  return await accountsModels.create(data)
}

module.exports.accountUpdate = async (filter, update) => {
  return await accountsModels.findOneAndUpdate(filter, update, { new: true })
}