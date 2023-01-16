const {
    accountsHeader,
    accountsPathSchema,
    accountsQuerySchema,
    accountsBodySchema,
    accountsBodyUpdateSchema
} = require('./accounts.interface')

const j2s = require('joi-to-swagger')
const { schemaResponse } = require('./../../utils/response')
const response = j2s(schemaResponse).swagger

const routeName = 'accounts'

const swaggerDoc = [
    {
        "url": '/party-service/api/v1/accounts-management/accounts',
        "method": 'get',
        "description": 'Get Accounts List',
        "tags": [routeName],
        "request": {
            "header": accountsHeader,
            "query": accountsQuerySchema
        },
        "responses": {
            "20000": {
                "description": 'response success',
                "content": {
                    "application/json": {
                        "schema": response
                    }
                }
            },
            "50000": {
                "description": 'response failed',
                "content": {
                    "application/json": {
                        "schema": response
                    }
                }
            },
        }
    },
    {
        "url": '/party-service/api/v1/accounts-management/accounts/{_id}',
        "method": 'get',
        "description": 'Get Accounts Detail',
        "tags": [routeName],
        "request": {
            "header": accountsHeader,
            "path": accountsPathSchema
        },
        "responses": {
            "20000": {
                "description": 'response success',
                "content": {
                    "application/json": {
                        "schema": response
                    }
                }
            },
            "50000": {
                "description": 'response failed',
                "content": {
                    "application/json": {
                        "schema": response
                    }
                }
            },
        }
    },
    {
        "url": '/party-service/api/v1/accounts-management/accounts',
        "method": 'post',
        "description": 'Insert Accounts',
        "tags": [routeName],
        "request": {
            "header": accountsHeader,
            "body": accountsBodySchema
        },
        "responses": {
            "20000": {
                "description": 'response success',
                "content": {
                    "application/json": {
                        "schema": response
                    }
                }
            },
            "50000": {
                "description": 'response failed',
                "content": {
                    "application/json": {
                        "schema": response
                    }
                }
            },
        }
    },
    {
        "url": '/party-service/api/v1/accounts-management/accounts',
        "method": 'patch',
        "description": 'Update Accounts',
        "tags": [routeName],
        "request": {
            "header": accountsHeader,
            "query": accountsPathSchema,
            "body": accountsBodyUpdateSchema
        },
        "responses": {
            "20000": {
                "description": 'response success',
                "content": {
                    "application/json": {
                        "schema": response
                    }
                }
            },
            "50000": {
                "description": 'response failed',
                "content": {
                    "application/json": {
                        "schema": response
                    }
                }
            },
        }
    },
]

module.exports = { swaggerDoc }