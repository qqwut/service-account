const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');
const formidable = require('formidable');
const { genResponseObj } = require('./response');
const CONFIG = require('./../config');
const { logger, generateDetailLogOptional } = require('./logger');
const constants = require('../config/constants');
const { LEVEL, ACTIONS } = constants.logGas;

const validateFileToFromData = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      let response = {
        fieldList: [],
        fileObj: {}
      };
      new formidable.IncomingForm().parse(req).on('error', (err) => {
        return reject(genResponseObj(req.get('x-language'), '40000', err, undefined, CONFIG.NODE));
      }).on('aborted', () => {
        return reject(genResponseObj(req.get('x-language'), '40000', 'Request aborted by the user', undefined, CONFIG.NODE));
      }).on('field', (key, value) => {
        response.fieldList.push({ key, value });
      }).on('file', (name, file) => {
        response.fileObj = {
          fileKey: name,
          fileName: file.name,
          fileSize: file.size,
          fileUploadDate: file.lastModifiedDate === null ? new Date() : file.lastModifiedDate,
          fsReadFile: file.path
        };
      }).on('end', () => {
        return resolve(response);
      });
    } catch (err) {
      return reject(genResponseObj(req.get('x-language'), '40000', err, undefined, CONFIG.NODE));
    }
  });
};

const padNumberWithZeroFormatWithLength = (number, length) => {
  return parseInt(number, 10).toString().padStart(length, '0');
};

const generateTransactionId = () => {
  const dateString = moment().format('YYYYMMDDHHMMSSsss');
  const randomNumber = `${Math.floor(Math.random() * 10000 + 1)}`;
  const random = padNumberWithZeroFormatWithLength(randomNumber, 4);
  return `${dateString}${random}`;
};

const request = {
  get: async (req = null, node, cmd = '') => {
    const property = {
      method: 'GET',
      url: req.url,
      headers: req.headers,
      timeout: req.timeout,
    };
    const option = generateDetailLogOptional(cmd, ACTIONS.REQUEST, CONFIG.NODE, node, { service: true })
    logger.detail.info(req, null, null, option);
    return await axios(property)
      .then(response => handleSuccess(node, response, req, cmd))
      .catch(error => handleError(node, error, req, cmd));
  },

  post: async (req = null, node, cmd = '') => {
    const property = {
      method: 'POST',
      url: req.url,
      headers: req.headers,
      data: req.body,
      timeout: req.timeout,
    };
    const option = generateDetailLogOptional(cmd, ACTIONS.REQUEST, CONFIG.NODE, node, { service: true })
    logger.detail.info(req, null, null, option);
    return await axios(property)
      .then(response => handleSuccess(node, response, req, cmd))
      .catch(error => handleError(node, error, req, cmd));
  },

  patch: async (req = null, node, cmd = '') => {
    const property = {
      method: 'PATCH',
      url: req.url,
      headers: req.headers,
      data: req.body,
      timeout: req.timeout
    };
    const option = generateDetailLogOptional(cmd, ACTIONS.REQUEST, CONFIG.NODE, node, { service: true })
    logger.detail.info(req, null, null, option);
    return await axios(property)
      .then(response => handleSuccess(node, response, req, cmd))
      .catch(error => handleError(node, error, req, cmd));
  },

  postFile: async (req, url, header, data, node) => {
    const property = {
      method: 'POST',
      url,
      headers: header,
      data: data,
      timeout: req.timeout
    };
    return await axios(property)
      .then(response => handleSuccess(node, response, property, logOption))
      .catch(error => handleError(node, error, url, req));
  },
};

function handleSuccess(node, result, req, cmd) {
  if (result.status !== 200 && result.status !== 201) {
    throw result;
  }
  const response = {
    resultData: (result.data !== undefined ? result.data: result) || {},
    headers: result.headers || {},
    httpStatus: result.status || {}
  }
  if (req) {
    const option = generateDetailLogOptional(cmd, ACTIONS.RESPONSE, node, CONFIG.NODE, { service: true })
    logger.detail.info(req, response, null, option);
  } else {
    logger.detail.console(LEVEL.INFO, result);
  }
  return response.resultData;
}

function handleError(node, error, req, cmd) {
  if (req) {
    if (error.response) {
      const dataError = {
        resultData: error.response.data || {},
        headers: error.response.headers || {},
        httpStatus: error.response.status || {}
      }
      logger.detail.error(req, dataError, '', generateDetailLogOptional(cmd, ACTIONS.RESPONSE, node, CONFIG.NODE, { service: true }));

      if (error.response && error.response.data && error.response.data.resultCode) {
        throw genResponseObj(req.headers['x-language'] || 'en', error.response.data.resultCode, error.response.data.developerMessage, undefined, node);
      } else {
        throw genResponseObj(req.headers['x-language'] || 'en', '50000', error, undefined, node);
      }

    } else {
      const dataError = error.message ? error.message : error;
      logger.detail.error(req, dataError, '', generateDetailLogOptional(cmd, ACTIONS.RESPONSE, node, CONFIG.NODE, { service: true }));
      throw genResponseObj(req.get('x-language') || 'en', '50000', error, undefined, node);
    }

  } else {
    logger.error(error);
    throw genResponseObj(null, '50000', error, undefined, node);
  }
}

const generateLinks = (originalUrl, meta) => {
  const page = Number(meta.currentPage)
  if (!meta) return { prev: '', next: '' }

  const url1 = originalUrl.split('page=');

  if (url1.length > 1)
    var firstUrl = `${url1[0]}page=`;
  else
    var firstUrl = `${url1[0]}?page=`;


  if (url1[1]) {
    const url2 = url1[1].split('&');
    var lastUrl = `${url2[1] ? '&' + url2[1] : ''}`
  }

  if (page > 1) {

    if (page === meta.totalPages) {
      return {
        prev: `${firstUrl}${page - 1}${lastUrl || ''}`,
        next: ``
      }

    } else if (page < meta.totalPages) {
      return {
        prev: `${firstUrl}${page - 1}${lastUrl || ''}`,
        next: `${firstUrl}${page + 1}${lastUrl || ''}`
      }
    }

  } else {
    if (page === meta.totalPages) {
      return {
        prev: ``,
        next: ``
      }
    } else if (meta.totalPages === 0) {
      return {
        prev: ``,
        next: ``
      }
    }
    else {
      return {
        prev: ``,
        next: `${firstUrl}${page + 1}${lastUrl || ''}`,
      }
    }
  }
}

module.exports = {
  request,
  validateFileToFromData,
  generateTransactionId,
  generateLinks
};
