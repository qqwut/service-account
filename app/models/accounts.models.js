const { boolean } = require('joi');
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12)
// const { eventLog } = require('./../utils/logger/logger.models');

const accounts = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid() },
    name: { type: String, default: null },
    companyId: { type: String, default: null },
    mcc: { type: String, default: null },
    mnc: { type: String, default: null },
    networkName: { type: String, default: null },
    networkType: { type: String, default: null },
    localCurrency: { type: String, default: null },
    localTime: { type: String, default: null },
    countryCode: { type: String, default: null },
    areaCode: { type: String, default: null },
    geoRegionZone: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    province: { type: String, default: null },
    zipCode: { type: String, default: null },
    country: { type: String, default: null },
    paymentDueDate: { type: String, default: null },
    netFlag: { type: Boolean, default: null },
    status: { type: String, default: null },
    createdBy: { type: String, default: null },
    createdDate: { type: Date, default: null },
    updatedBy: { type: String, default: null },
    updatedDate: { type: Date, default: null }
  },
  { versionKey: false }
);

// accounts.plugin(eventLog);
const collectionName = 'accounts';
module.exports = mongoose.model('accounts', accounts, collectionName);