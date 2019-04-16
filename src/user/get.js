'use strict';

const { ResourceNotFoundError } = require('../errors');
const { apiErrorResponse, apiResponse  } = require('../middleware');
const dynamodb = require('../config/dynamodb');

async function handler(event) {
  const params = event.pathParameters;
  return get(params)
    .then(user => { return apiResponse(200, serialize(user)); })
    .catch(error => { return apiErrorResponse(error); });
}

async function get(params) {
  return dbGet(params);
}

async function dbGet(params) {
  const dynamoParams = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Key: { id: params.id, }
  };
  return dynamodb.get(dynamoParams).promise()
    .then((result) => {
      if(!result.Item) {
        throw new ResourceNotFoundError('User');
      }
      return result.Item;
    });
}

const serialize = (user) => {
  delete user.password;
  user.updatedAt = new Date(user.updatedAt);
  user.createdAt = new Date(user.createdAt);
  return user;
};

module.exports = {
  handler,
  get,
};
