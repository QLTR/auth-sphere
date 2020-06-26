'use strict';

const { apiErrorResponse, apiResponse  } = require('../middleware');
const dynamodb = require('../config/dynamodb');

const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

async function handler(event) {
  const params = Object.assign(JSON.parse(event.body), event.pathParameters);
  return update(params)
    .then(user => { return apiResponse(200, serialize(user)); })
    .catch(error => { return apiErrorResponse(error); });
}

async function update(params) {
  let datas = Object.assign({}, params);

  if (typeof params.password != 'undefined') {
    delete datas.password;

    return bcrypt.hash(params.password, saltRounds).then(hash => {
      datas.password = hash;
      return dbUpdate(datas);
    });
  } else {
    return dbUpdate(datas);
  }
}

async function dbUpdate(params) {
  const timestamp = new Date().getTime();
  let expressionAttributeNames = {};
  let expressionAttributeValues = { ':updatedAt': timestamp };
  let updateExpression = 'SET updatedAt = :updatedAt';

  if (typeof params.name != 'undefined') {
    expressionAttributeNames['#name'] = 'name';
    expressionAttributeValues[':name'] = params.name;
    updateExpression += ', #name = :name';
  }
  if (typeof params.email != 'undefined') {
    expressionAttributeNames['#email'] = 'email';
    expressionAttributeValues[':email'] = params.email;
    updateExpression += ', #email = :email';
  }
  if (typeof params.password!= 'undefined') {
    expressionAttributeNames['#password'] = 'password';
    expressionAttributeValues[':password'] = params.password;
    updateExpression += ', #password= :password';
  }

  const dynamoParams = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Key: { id: params.id, },
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    UpdateExpression: updateExpression,
    ReturnValues: 'ALL_NEW',
  };


  return dynamodb.update(dynamoParams).promise()
    .then((user) => { return user.Attributes; });
}

const serialize = (user) => {
  delete user.password;
  user.updatedAt = new Date(user.updatedAt);
  user.createdAt = new Date(user.createdAt);
  return user;
};

module.exports = {
  handler,
  update,
};
