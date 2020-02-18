const { handler, create } = require('../create');
const dynamodb = require('../../config/dynamodb');

const params = { name: 'User One', email: 'user.one@auth-sphere.com',
  password: 'password1234567890' };

describe('User#create', () => {
  it('should insert a user in dynamoDB', async () => {
    const user = await create(params);

    const dynamoParams = {
      TableName: process.env.DYNAMODB_TABLE_USERS,
      Key: {id: user.id }
    };
    const {Item} = await dynamodb.get(dynamoParams).promise();
    expect(Item).toBeDefined();
    expect(Item).toEqual(user);
  });

  it('should return the created user', async () => {
    const user = await create(params);

    expect(user.name).toEqual(params.name);
    expect(user.email).toEqual(params.email);
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.password).not.toEqual(params.password);
  });
});

describe('User#handler', () => {
  it('should return the created user', async () => {
    const event = { body: JSON.stringify(params) };
    const response = await handler(event);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeDefined();

    const body = JSON.parse(response.body);
    expect(body.name).toEqual(params.name);
    expect(body.email).toEqual(params.email);
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.password).not.toBeDefined();
  });
});
