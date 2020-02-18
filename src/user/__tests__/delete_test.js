const { handler, remove } = require('../delete');
const dynamodb = require('../../config/dynamodb');
const uuid = require('uuid');
var user;

beforeEach(async () =>{
  const dynamoParams = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Item: {
      id: uuid.v4(),
      name: 'User One',
      email: 'user.one@auth-sphere.com',
      password: 'password1234567890'
    }
  };

  await dynamodb.put(dynamoParams).promise();
  user = dynamoParams.Item;
});

describe('User#remove', () => {
  it('should delete a user in dynamoDB', async () => {
    await remove({ id: user.id });

    const dynamoParams = {
      TableName: process.env.DYNAMODB_TABLE_USERS,
      Key: {id: user.id }
    };
    const {Item} = await dynamodb.get(dynamoParams).promise();
    expect(Item).not.toBeDefined();
  });
});

describe('User#handler', () => {
  it('should return 204 with empty body', async () => {
    const event = { pathParameters: { id: user.id } };
    const response = await handler(event);
    expect(response.statusCode).toEqual(204);
    expect(response.body).toBeDefined();

    const body = JSON.parse(response.body);
    expect(body).toEqual({});
  });
});
