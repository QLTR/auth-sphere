const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const isTest = process.env.JEST_WORKER_ID;
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  }),
};

const dynamodb = new AWS.DynamoDB.DocumentClient(config);
module.exports = dynamodb;
