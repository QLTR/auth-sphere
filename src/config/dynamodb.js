const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const dynamodb = new AWS.DynamoDB.DocumentClient();
module.exports = dynamodb;
