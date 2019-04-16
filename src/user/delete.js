'use strict';

const { apiErrorResponse, apiResponse  } = require('../middleware');
const dynamodb = require('../config/dynamodb');

async function handler(event) {
  const params = event.pathParameters;
  return remove(params)
    .then(() => { return apiResponse(204); })
    .catch(error => { return apiErrorResponse(error); });
}

async function remove(params) {
  return dbDelete(params);
}

async function dbDelete(params) {
  const dynamoParams = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Key: { id: params.id, }
  };
  return dynamodb.delete(dynamoParams).promise();
}

module.exports = {
  handler,
  remove,
};
