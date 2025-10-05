const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const isOffline = process.env.IS_OFFLINE === 'true';

const client = new DynamoDBClient({
  region: 'us-east-1',
  ...(isOffline && { endpoint: 'http://localhost:8000' }) // use local DB when offline
});

const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.USERS_TABLE;

// Create user
module.exports.create = async (event) => {
  try {
    const data = JSON.parse(event.body);
    if (!data.name || !data.email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Name and email are required' }) };
    }

    const user = { id: uuidv4(), name: data.name, email: data.email };

    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: user }));

    return { statusCode: 200, body: JSON.stringify(user) };
  } catch (err) {
    console.error('Create user failed:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not create user' }) };
  }
};

// Get user
module.exports.get = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));

    if (!result.Item) {
      return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
    }

    return { statusCode: 200, body: JSON.stringify(result.Item) };
  } catch (err) {
    console.error('Get user failed:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not get user' }) };
  }
};

// List users
module.exports.list = async () => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
    return { statusCode: 200, body: JSON.stringify(result.Items || []) };
  } catch (err) {
    console.error('List users failed:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not list users' }) };
  }
};

// Update user
module.exports.update = async (event) => {
  try {
    const { id } = event.pathParameters;
    const data = JSON.parse(event.body);

    const result = await ddb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set #name = :name',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: { ':name': data.name },
      ReturnValues: 'ALL_NEW',
    }));

    return { statusCode: 200, body: JSON.stringify(result.Attributes) };
  } catch (err) {
    console.error('Update user failed:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not update user' }) };
  }
};

// Delete user
module.exports.remove = async (event) => {
  try {
    const { id } = event.pathParameters;

    await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));

    return { statusCode: 200, body: JSON.stringify({ message: 'User deleted' }) };
  } catch (err) {
    console.error('Delete user failed:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not delete user' }) };
  }
};
