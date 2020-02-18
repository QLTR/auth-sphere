const { handler, update } = require('../update');
const dynamodb = require('../../config/dynamodb');
const uuid = require('uuid');
var user;

beforeEach(async () =>{
  const timestamp = new Date().getTime();

  const dynamoParams = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Item: {
      id: uuid.v4(),
      name: 'User One',
      email: 'user.one@auth-sphere.com',
      password: 'password1234567890',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  await dynamodb.put(dynamoParams).promise();
  user = dynamoParams.Item;
});

afterEach(async () =>{
  const dynamoParams = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Key: { id: user.id, }
  };
  await dynamodb.delete(dynamoParams).promise();
});

describe('User#update', () => {
  it('should get the user from dynamoDB', async () => {
    const newParams = { id: user.id, name: 'new_name',
      email: 'new.email@auth-sphere.com', password: 'newpassword1234567890' };
    const item = await update(newParams);
    expect(item).not.toEqual(user);

    expect(item.id).toEqual(user.id);
    expect(item.createdAt).toEqual(user.createdAt);
    expect(item.updatedAt).not.toEqual(user.updatedAt);
    expect(item.name).toEqual(newParams.name);
    expect(item.email).toEqual(newParams.email);
    expect(item.password).toBeDefined();
    expect(item.password).not.toEqual(user.password);
  });
});

describe('User#handler', () => {
  it('should return 200 with updated user', async () => {
    const newParams = { name: 'new_name', email: 'new.email@auth-sphere.com',
      password: 'newpassword1234567890' };
    const event = { pathParameters: { id: user.id },
      body: JSON.stringify(newParams) };

    const response = await handler(event);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();

    const body = JSON.parse(response.body);
    expect(body.name).toEqual(newParams.name);
    expect(body.email).toEqual(newParams.email);
    expect(body.id).toEqual(user.id);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.password).not.toBeDefined();
  });
});
