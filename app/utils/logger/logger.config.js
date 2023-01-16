const { winston, createLogger, format, transports } = require('winston');
const moment = require('moment');
const CONFIG = require('../../config'); // Load config (environment)
const { LOG, NODE, ENV } = require('../../config');

require('winston-daily-rotate-file');
require('events').EventEmitter.defaultMaxListeners = 0;

const LOG_TYPE = {
    ROOT: 'root',
    DATABASE: 'database',
    SERVICE: 'service',
    SUMMARY: 'summary',
    DETAIL: 'detail'
};

const LOG_LEVEL = {
    INFO: 'info',
    DEBUG: 'debug',
    ERROR: 'error',
    CONSOLE: 'console'
};

const LOG_SERVICE_TYPE = {
    ADMD: 'admd',
    EMAIL: 'email',
};

const getDailyRotateConfig = (filename, level = LOG.FILE_LEVEL, datePattern = 'YYYYMMDDHHmm') => {
    return {
        timestamp: () => {
            return moment().format(datePattern);
        },
        filename,
        datePattern,
        level,
        handleExceptions: true,
        frequency: '15m',
        maxSize: '100m',
    };
};

const addLogger = (level = 'info', type = LOG_TYPE.ROOT, data = '') => {
    if (type === LOG_TYPE.DETAIL || type === LOG_TYPE.SUMMARY) {
        let formatTimestamp = 'YYYY-MM-DDTHH:mm:ss.SSS';
        let formats = format.json();
        let print = format.printf(info => `${info.message}`);
        let transport = [
            new transports.DailyRotateFile(
                getDailyRotateConfig(`${CONFIG.LOG.ROOT_PATH}/${type}/${CONFIG.APP_NAME.toLocaleLowerCase()}_${type}_%DATE%.log`, level)
            ),
            new transports.Console({
                level: LOG.CONSOLE_LEVEL,
                handleExceptions: true,
                json: false,
                colorize: true,
            })
        ]

        // if (type === LOG_TYPE.ROOT) {
        //     formats = format.timestamp();
        //     print = format.printf(info => `${moment(new Date()).format(formatTimestamp)}||${info.message}`);
        //     transport.push(new transports.Console({
        //         level: LOG.CONSOLE_LEVEL,
        //         handleExceptions: true,
        //         json: false,
        //         colorize: true,
        //     }));
        // }

        if (data === 'init logger') {
            print = format.printf(info => '');
        }

        const logger = createLogger({
            format: format.combine(formats, print),
            transports: transport
        });

        logger[level](data);
    }
}

// CREATE FOLDER
// addLogger(LOG_LEVEL.INFO, LOG_TYPE.ROOT, 'init logger');
// addLogger(LOG_LEVEL.INFO, LOG_TYPE.DATABASE, 'init logger');
// addLogger(LOG_LEVEL.INFO, LOG_TYPE.SERVICE, 'init logger');
addLogger(LOG_LEVEL.INFO, LOG_TYPE.SUMMARY, 'init logger');
addLogger(LOG_LEVEL.INFO, LOG_TYPE.DETAIL, 'init logger');

module.exports = {
    addLogger,
    LOG_LEVEL,
    LOG_TYPE,
    LOG_SERVICE_TYPE
}
