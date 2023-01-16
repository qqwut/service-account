'use strict';
const j2s = require('joi-to-swagger');

const interfaceSwagger = [
  // require('./modules/product-offering')
]

let swaggerDoc = {
  "openapi": "3.0.0",
  "info": {
    "title": 'service-product-offering',
    "version": "0.1.9",
    "description": 'Demonstrating how to describe a RESTful API',
  },
  "paths": {}
}

interfaceSwagger.forEach((eleInterface) => {
  eleInterface.swaggerDoc.forEach((element, i) => {

    let parameters = []
    let body = {};

    Object.keys(element.request).map((type) => {
      const required = {};


      if (type === 'header' || type === 'query' || type === 'path') {

        let query = j2s(element.request[type]).swagger;
        if (query.required) {
          query.required.map(res => { required[res] = true });
        }

        Object.keys(query.properties).forEach((key) => {
          parameters.push({
            "in": type,
            "name": key,
            "type": query.properties[key].type,
            "required": required[key] || false,
            "schema": {
              "type": query.properties[key].type
            }
          })
        });

      }

      if (type === 'body') {
        body = {
          "content": {
            "application/json": {
              "schema": j2s(element.request[type]).swagger
            }
          }
        };
      }

    });

    const document = {
      summary: element.description,
      tags: element.tags,
      parameters: parameters || [],
      responses: element.responses
    }

    if (body.content) {
      document.requestBody = body || null;
    }


    if (swaggerDoc.paths[element.url]) {
      if (!swaggerDoc.paths[element.url][element.method.toLowerCase()]) {
        swaggerDoc.paths[element.url][element.method.toLowerCase()] = document
      }
    } else {
      swaggerDoc.paths[element.url] = {
        [element.method.toLowerCase()]: document
      }
    }

  });
});

module.exports = swaggerDoc;