const { resMessage } = require('./message.properties');

module.exports = {
  resCode: {
    20000: {
      httpStatus: 200,
      resultCode: "20000",
      developerMessage: resMessage.common.none
    },
    20001: {
      httpStatus: 200,
      resultCode: "20001",
      developerMessage: resMessage.common.success
    },
    20100: {
      httpStatus: 201,
      resultCode: "20100",
      developerMessage: resMessage.common.createSuccess
    },
    40000: {
      httpStatus: 400,
      resultCode: "40000",
      developerMessage: resMessage.common.missing
    },
    40001: {
      httpStatus: 400,
      resultCode: "40001",
      developerMessage: resMessage.common.incorrectFormat
    },
    40002: {
      httpStatus: 400,
      resultCode: "40002",
      developerMessage: resMessage.common.documentEdited
    },
    40003: {
      httpStatus: 400,
      resultCode: "40003",
      developerMessage: resMessage.common.unableAccess
    },
    40100: {
      httpStatus: 401,
      resultCode: "40100",
      developerMessage: resMessage.common.accessDenied
    },
    40101: {
      httpStatus: 401,
      resultCode: "40101",
      developerMessage: resMessage.common.permissionDenied
    },
    40300: {
      httpStatus: 403,
      resultCode: "40300",
      developerMessage: resMessage.common.credential
    },
    40400: {
      httpStatus: 404,
      resultCode: "40400",
      developerMessage: resMessage.common.notFound
    },
    40401: { // MAP STATUS PDNG เนื่องจาก resultCode 40401 เราไม่มี
      httpStatus: 404,
      resultCode: "40400",
      developerMessage: resMessage.common.notFound
    },
    41700: {
      httpStatus: 417,
      resultCode: "41700",
      developerMessage: resMessage.common.incorrectIdentify
    },
    41701: {
      httpStatus: 417,
      resultCode: "41701",
      developerMessage: resMessage.common.incorrectContent
    },
    41702: {
      httpStatus: 417,
      resultCode: "41702",
      developerMessage: resMessage.common.notAllowFile
    },
    42200: {
      httpStatus: 422,
      resultCode: "42200",
      developerMessage: resMessage.common.already
    },
    50000: {
      httpStatus: 500,
      resultCode: "50000",
      developerMessage: resMessage.common.internalError
    },
    50001: {
      httpStatus: 500,
      resultCode: "50001",
      developerMessage: resMessage.common.incorrectBackend
    },
    50002: {
      httpStatus: 500,
      resultCode: "50002",
      developerMessage: resMessage.common.databaseError
    },
    50003: {
      httpStatus: 500,
      resultCode: "50003",
      developerMessage: resMessage.common.unknownFormat
    }
  },
  logGas: {
    NODE_TYPE: {
      CLIENT: 'CLIENT'
    },
    LEVEL: {
      INFO: 'info',
      DEBUG: 'debug',
      ERROR: 'error',
    },
    ACTIONS: {
      REQUEST: 'REQUEST',
      RESPONSE: 'RESPONSE',
    },
  },
  relatedParty: {
    SERVICE_PROVIDER: 'SERVICE_PROVIDER',
    SUPPLIER: 'SUPPLIER',
  }

};
