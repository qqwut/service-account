const { response, responseError, genResponseObj } = require('../response');
const CONFIG = require('./../../config');
const { logger } = require('./../../utils/logger');

const property = {
  BODY: 'body',
  QUERY: 'query',
  PARAMS: 'params'
};

const validation = (schema, prop = property.BODY, cmd = '') => {
  return ((req, res, next) => {
    const temp = JSON.parse(JSON.stringify(req[prop]));
    if (prop === property.QUERY) {
      for (const property in temp) {
        try {
          temp[property] = JSON.parse(temp[property])
        } catch (error) {
        }
      }
    }
    const { error, value } = schema.validate(temp);
    if (error) {
      return responseError(req, res, genResponseObj(req.get('x-language'), '40000', error.details[0].message, undefined, CONFIG.NODE), cmd);
    } else {
      next();
    }
  });
};

const validateBySchema = (prop = property.BODY, schema, req) => {

  const temp = JSON.parse(JSON.stringify(req[prop]));
  if (prop === property.QUERY) {
    for (const property in temp) {
      try {
        temp[property] = JSON.parse(temp[property])
      } catch (error) {
      }
    }
  }
  const { error, value } = schema.validate(temp);

  if (error) {
    throw genResponseObj(req.get('x-language'), '40000', error.details[0].message, undefined, CONFIG.NODE);
  } else {
    return
  }
};

const validate = {
  body: (schema, req) => validateBySchema(property.BODY, schema, req),
  query: (schema, req) => validateBySchema(property.QUERY, schema, req),
  params: (schema, req) => validateBySchema(property.PARAMS, schema, req),
}

module.exports = { validation, validate, property };
