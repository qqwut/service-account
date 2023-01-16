const Joi = require('joi')
const CONFIG = require('../../config')

const accountsQuerySchema = Joi.object({
    _id: Joi.string().optional(),
    companyId: Joi.any().optional(),
    accountId: Joi.any().optional(),
    name: Joi.string().optional(),
    mcc: Joi.string().optional(),
    mnc: Joi.string().optional(),
    limit: Joi.number().integer().min(1).optional(),
    page: Joi.number().integer().min(1).optional(),
    sortBy: Joi.string().optional(),
    order: Joi.string().equal('asc', 'desc').optional(),
})

const accountsBodySchema = Joi.object({
    name: Joi.string().required().messages({ 'any.required': 'name is required' }),
    companyId: Joi.string().required().messages({ 'any.required': 'companyId is required' }),
    mcc: Joi.string().required().messages({ 'any.required': 'mcc is required' }),
    mnc: Joi.string().required().messages({ 'any.required': 'mnc is required' }),
    networkName: Joi.string().required().messages({ 'any.required': 'networkName is required' }),
    networkType: Joi.string().required().messages({ 'any.required': 'networkType is required' }),
    localCurrency: Joi.string().required().messages({ 'any.required': 'localCurrency is required' }),
    localTime: Joi.string().required().messages({ 'any.required': 'localTime is required' }),
    countryCode: Joi.string().required().messages({ 'any.required': 'countryCode is required' }),
    areaCode: Joi.string().required().messages({ 'any.required': 'areaCode is required' }),
    geoRegionZone: Joi.string().required().messages({ 'any.required': 'geoRegionZone is required' }),
    address: Joi.string().required().messages({ 'any.required': 'address is required' }),
    city: Joi.string().required().messages({ 'any.required': 'city is required' }),
    province: Joi.string().required().messages({ 'any.required': 'province is required' }),
    zipCode: Joi.string().required().messages({ 'any.required': 'zipCode is required' }),
    country: Joi.string().required().messages({ 'any.required': 'country is required' }),
    paymentDueDate: Joi.number().required().messages({ 'any.required': 'paymentDueDate is required' }),
    netFlag: Joi.boolean().optional(),
    // netFlag: Joi.boolean().required().messages({ 'any.required': 'netFlag is required' }),
    status: Joi.string().required().messages({ 'any.required': 'status is required' }),
    createdBy: Joi.string().optional().messages({ 'any.required': 'createdBy is required' }),
    createdDate: Joi.date().optional().messages({ 'any.required': 'createdDate is required' }),
    updatedBy: Joi.string().optional().messages({ 'any.required': 'updatedBy is required' }),
    updatedDate: Joi.date().optional().messages({ 'any.required': 'updatedDate is required' }),
})

const accountsBodyUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    companyId: Joi.string().optional(),
    mcc: Joi.string().optional(),
    mnc: Joi.string().optional(),
    networkName: Joi.string().optional(),
    networkType: Joi.string().optional(),
    localCurrency: Joi.string().optional(),
    localTime: Joi.string().optional(),
    countryCode: Joi.string().optional(),
    areaCode: Joi.string().optional(),
    geoRegionZone: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    province: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional(),
    paymentDueDate: Joi.number().optional(),
    netFlag: Joi.boolean().optional(),
    status: Joi.string().optional(),
    createdBy: Joi.string().optional(),
    createdDate: Joi.date().optional(),
    updatedBy: Joi.string().optional(),
    updatedDate: Joi.date().optional(),
})

const accountsPathSchema = Joi.object({
    _id: Joi.string().required().messages({ 'any.required': '_id is required' })
})

const accountsHeader = Joi.object({
    // [CONFIG.HEADER.HEADER_APP]: Joi.string().required().messages({ 'any.required': `${CONFIG.HEADER.HEADER_APP} is required` }),
    // [CONFIG.HEADER.HEADER_TRANSACTION_ID]: Joi.string().required().messages({ 'any.required': `${CONFIG.HEADER.HEADER_TRANSACTION_ID} is required` }),
    // [CONFIG.HEADER.HEADER_PUBLIC_ID]: Joi.string().required().messages({ 'any.required': `${CONFIG.HEADER.HEADER_PUBLIC_ID} is required` })
})

module.exports = {
    accountsQuerySchema,
    accountsBodySchema,
    accountsPathSchema,
    accountsBodyUpdateSchema,
    accountsHeader
}
