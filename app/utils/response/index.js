const constants = require('../../config/constants');
const CONFIG = require('../../config');
const Joi = require('joi');
const { logger, generateSummaryLogResponse, generateSummaryLogOptional, generateDetailLogOptional } = require('./../logger');
const { ACTIONS } = require('../../config/constants').logGas;

const setHeader = (req, response = {}) => {
  let newHeader = {
    [CONFIG.HEADER.HEADER_TRANSACTION_ID]: req.get(CONFIG.HEADER.HEADER_TRANSACTION_ID.toLocaleLowerCase()),
    [CONFIG.HEADER.HEADER_PUBLIC_ID]: req.get(CONFIG.HEADER.HEADER_PUBLIC_ID.toLocaleLowerCase()),
    'Content-Type': 'application/json',
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff'
  };
  if (req.method === 'POST' && response && response._id) {
    const uri = req.baseUrl.split('/');
    newHeader['Location'] = `/${uri[uri.length - 1]}/${response._id}`;
  }
  return newHeader;
}

const response = (req, res, response = null, command = '', now = Date.now()) => {
  const language = req.get('x-language') || 'en';
  res.set(setHeader(req, response));

  // set code
  let showBody = true
  let code = constants.resCode[20000];

  if (req.method == 'POST') {
    showBody = false
    code = constants.resCode[20100]
  }
  if (req.method == 'PATCH' || req.method == 'DELETE') {
    showBody = false
    code = constants.resCode[20000]
  }

  const data = {
    httpStatus: code.httpStatus,
    resultCode: code.resultCode,
    userMessage: code.developerMessage[language] || '',
    developerMessage: `[${CONFIG.NODE}] ${code.developerMessage[language] || ''}`,
    resultData: showBody ? response : {},
    transactionResult: 20000,
    transactionDesc: 'Success',
  }

  res.status(code.httpStatus);

  // Logger
  const optionLog = generateDetailLogOptional(command, ACTIONS.RESPONSE, CONFIG.NODE, req.get(CONFIG.HEADER.HEADER_APP) || 'unknown');
  logger.detail.info(req, data, 'success', optionLog, res);
  logger.summary.info(req, data, generateSummaryLogOptional(command, now));

  if (req.method == 'POST' || req.method == 'PATCH' || req.method == 'DELETE')
    res.send();
  else
    res.send(response);
}

const responseError = (req, res, respObj, command = '', now = Date.now()) => {
  const codeList = constants.resCode;
  const language = req.get('x-language') || 'en';
  let code = constants.resCode[50000];

  if (respObj && respObj.resultCode && codeList[respObj.resultCode]) {
    code = codeList[respObj.resultCode]
  }

  // logger
  const data = {
    httpStatus: code.httpStatus,
    resultCode: code.resultCode,
    userMessage: code.developerMessage[language] || '',
    developerMessage: `[${CONFIG.NODE}] ${code.developerMessage[language] || ''}`,
    transactionResult: 50000,
    transactionDesc: 'Failed',
    resultData: respObj
  }

  // LoggerHEADER_APP
  const optionLog = generateDetailLogOptional(command, ACTIONS.RESPONSE, CONFIG.NODE, req.get(CONFIG.HEADER.HEADER_APP) || 'unknown');
  logger.detail.error(req, data, 'error', optionLog, res);
  logger.summary.error(req, data, generateSummaryLogOptional(command, now));

  // response
  return res
    .status(code.httpStatus)
    .set(setHeader(req))
    .json({
      resultCode: data.resultCode,
      developerMessage: data.developerMessage
    });
}

const genResponseObj = (_language = 'en', _resultCode, _moreInfo, _resultData, _node) => {
  let messageObj = constants.resCode[50000].developerMessage;
  if (constants.resCode[_resultCode]) {
    messageObj = constants.resCode[_resultCode].developerMessage
  }
  const developerMessage = `[${_node}] ${messageObj[_language]}`;
  return {
    resultCode: _resultCode,
    developerMessage: developerMessage
  }
}

const schemaResponse = Joi.object({
  resultCode: Joi.string(),
  developerMessage: Joi.string(),
  userMessage: Joi.string(),
  moreInfo: Joi.string(),
  resultData: Joi.string(),
})

module.exports = {
  response,
  responseError,
  genResponseObj,
  schemaResponse
}
