'use strict';

const { apiErrorResponse, apiResponse  } = require('../middleware');
const dynamodb = require('../config/dynamodb');

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

async function handler(event) {
  const params = JSON.parse(event.body);
  return create(params)
    .then(user => { return apiResponse(201, serialize(user)); })
    .catch(error => { return apiErrorResponse(error); });
}

async function create(params) {
  return hashPassword(params).then((datas) => { return dbInsert(datas); });
}

async function hashPassword(params) {
  let datas = Object.assign({}, params);
  delete datas.password;

  return bcrypt.hash(params.password, saltRounds).then(hash => {
    datas.password = hash;
    return datas;
  });
}

async function dbInsert(params) {
  const timestamp = new Date().getTime();

  const dynamoParams = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Item: {
      id: uuid.v4(),
      email: params.email,
      name: params.name,
      password: params.password,
      updatedAt: timestamp,
      createdAt: timestamp,
    }
  };

  return dynamodb.put(dynamoParams).promise()
    .then(() => { return dynamoParams.Item; });
}

const serialize = (user) => {
  delete user.password;
  user.updatedAt = new Date(user.updatedAt);
  user.createdAt = new Date(user.createdAt);
  return user;
};

module.exports = {
  handler,
  create,
};
