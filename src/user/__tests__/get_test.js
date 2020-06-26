const { handler, get } = require('../get');
const dynamodb = require('../../config/dynamodb');
const uuid = require('uuid');
var user;

beforeAll(async () =>{
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

describe('User#get', () => {
  it('should get the user from dynamoDB', async () => {
    const item = await get({id: user.id});
    expect(item).toEqual(user);
  });
});

describe('User#handler', () => {
  it('should return 204 with empty body', async () => {
    const event = { pathParameters: { id: user.id } };
    const response = await handler(event);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();

    const body = JSON.parse(response.body);
    expect(body.name).toEqual(user.name);
    expect(body.email).toEqual(user.email);
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.password).not.toBeDefined();
  });
});
