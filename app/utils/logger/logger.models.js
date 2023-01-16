const moment = require('moment');
const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss.SSS'; // only use for timestamp
const CONFIG = require('../../config');

const modelDetailLog = (req, level, data = null, message = '', optional = null, res) => {
    let uri = optional && optional.uri ? optional.uri : req.originalUrl || '';
    let detail = {};

    let identity = req &&
        req.headers &&
        req.headers[CONFIG.HEADER.HEADER_PUBLIC_ID] ||
        req.headers[CONFIG.HEADER.HEADER_PUBLIC_ID.toLowerCase()]

    let tid = req &&
        req.headers &&
        req.headers[CONFIG.HEADER.HEADER_TRANSACTION_ID] ||
        req.headers[CONFIG.HEADER.HEADER_TRANSACTION_ID.toLowerCase()]

    if (res) {
        // APP RESPONSE
        const headers = res.getHeaders()
        detail.headers = headers || {}
        detail.httpStatus = data.httpStatus || res.statusCode

        if (data && data.resultData && Object.keys(data.resultData).length) {
            detail.body = data.resultData
        }

    } else {
        // ALL
        detail.headers = req && req.headers || {}

        if (optional.service) {
            detail.url = req.originalUrl
            detail.method = req.method
            uri = req.uri
        }

        if (data) {
            detail.httpStatus = (data.status || data.httpStatus) || 500;
            detail.body = (data.resultData || data) || {};
        } else {
            if (req && req.body && Object.keys(req.body).length) {
                detail.body = req.body;
            }
        }
    }

    let logModels = {
        level: level,
        type: 'detail',
        tid: tid || '',
        appName: CONFIG.APP_NAME,
        instance: CONFIG.NODE,
        identity: identity || 'unknown',
        uri: uri || '',
        httpMethod: req ? req.method : '',
        detail: JSON.stringify(detail),
        timestamp: getTimeStampGasLog(),
    };

    if (optional) {
        logModels = {
            ...logModels,
            ...optional,
        }
    }

    return JSON.stringify(logModels);
};

const modelSummaryLog = (req, level, data, optional = null) => {
    const { startTime: start, command } = optional;
    const startTime = parseInt(start, 10);
    const processTime = getResponseTime(startTime);
    const endTime = parseInt(startTime + processTime, 10);

    let responseHttpStatus = data && data.httpStatus || 500;

    let logData = {
        level: level,
        requestTimestamp: moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS'),
        type: 'summary',
        host: CONFIG.NODE,
        tid: req.get(CONFIG.HEADER.HEADER_TRANSACTION_ID.toLowerCase()) || '',
        appName: CONFIG.NODE,
        instance: CONFIG.NODE,
        identity: req.get(CONFIG.HEADER.HEADER_PUBLIC_ID.toLowerCase()) || 'unknown',
        httpMethod: req.method || '',
        uri: req.originalUrl || '',
        command: command || '',
        responseHttpStatus: data && data.httpStatus || '',
        responseResult: data && data.resultData ? data.resultData.toString() : '',
        responseDesc: data && data.userMessage || '',
        transactionResult: data && data.transactionResult ? data.transactionResult.toString() : '',
        transactionDesc: data && data.transactionDesc || '',
        responseTimestamp: moment(endTime).format('YYYY-MM-DD HH:mm:ss.SSS'),
        processTime: `${processTime} ms`,
        timestamp: getTimeStampGasLog(),
    };

    // change params by case
    if (responseHttpStatus === 200 || responseHttpStatus === 201) {
        delete logData.responseDesc;
        delete logData.responseResult;
    } else {
        logData.responseResult = data && data.resultCode ? data.resultCode.toString() : '';
        logData.responseDesc = data && data.developerMessage || '';
        logData.transactionResult = data && data.resultCode ? data.resultCode.toString() : '';
        logData.transactionDesc = data && data.developerMessage || '';
    }

    return JSON.stringify(logData);
};

const modelRootLog = (req = {}, message) => {
    if (message instanceof Object)
        return message.message || JSON.stringify(message);
    else
        return message;
};

const modelConsoleLog = (level, message) => {
    const result = {
        level: level,
        timestamp: getTimeStampGasLog(),
        detail: {
            message: message,
        }
    };
    return JSON.stringify(result);
}

const generateSummaryLogOptional = (serviceCommand, timeStamp) => {
    return {
        command: serviceCommand || '',
        startTime: timeStamp
    };
};

const generateSummaryLogResponse = (res, body) => {
    return {
        httpStatus: res.statusCode,
        body: body,
        headers: res.getHeaders()
    }
};

const generateDetailLogOptional = (serviceCommand, action, originNode, destinationNode, otherOption = null) => {
    const command = serviceCommand || '';
    const origin = originNode;
    const destination = destinationNode;
    let result = {
        command,
        action: `${action} (${origin} -> ${destination})`,
    };

    if (otherOption) {
        result = {
            ...result,
            ...otherOption
        }
    }
    return result;
};

const getResponseTime = startTime => {
    return Date.now() - startTime;
};

const getTimestamp = () => {
    return moment().format(DATE_FORMAT);
};

const getTimeStampGasLog = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
}

module.exports = {
    generateSummaryLogResponse,
    generateSummaryLogOptional,
    generateDetailLogOptional,
    modelSummaryLog,
    modelDetailLog,
    modelRootLog,
    modelConsoleLog
};
