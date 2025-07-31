const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB Client
const dynamodb = DynamoDBDocument.from(new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
}));

const USERS_TABLE = process.env.USERS_TABLE;

// Enhanced response formatter
const formatResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(data, null, 2),
});

// Input validator
const validateUserInput = (userData, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate) {
    if (!userData.name?.trim()) errors.push('Name is required');
    if (!userData.email?.trim()) errors.push('Email is required');
  }

  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Invalid email format');
  }

  return errors.length ? { valid: false, errors } : { valid: true };
};

module.exports.create = async (event) => {
  try {
    const requestBody = JSON.parse(event.body || '{}');
    const validation = validateUserInput(requestBody);
    
    if (!validation.valid) {
      return formatResponse(400, { errors: validation.errors });
    }

    const user = {
      id: uuidv4(),
      name: requestBody.name.trim(),
      email: requestBody.email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamodb.put({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(email)',
    });

    return formatResponse(201, user);
  } catch (error) {
    console.error('Create Error:', error);
    
    if (error.name === 'ConditionalCheckFailedException') {
      return formatResponse(409, { error: 'Email already exists' });
    }
    return formatResponse(500, { error: 'Internal server error' });
  }
};

module.exports.get = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return formatResponse(400, { error: 'User ID is required' });
    }

    const result = await dynamodb.get({
      TableName: USERS_TABLE,
      Key: { id },
    });

    if (!result.Item) {
      return formatResponse(404, { error: 'User not found' });
    }

    return formatResponse(200, result.Item);
  } catch (error) {
    console.error('Get Error:', error);
    return formatResponse(500, { error: 'Internal server error' });
  }
};

module.exports.list = async () => {
  try {
    const result = await dynamodb.scan({
      TableName: USERS_TABLE,
      Limit: 100,
    });

    return formatResponse(200, {
      users: result.Items || [],
      count: result.Count || 0,
    });
  } catch (error) {
    console.error('List Error:', error);
    return formatResponse(500, { error: 'Internal server error' });
  }
};

module.exports.update = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const requestBody = JSON.parse(event.body || '{}');
    
    if (!id) {
      return formatResponse(400, { error: 'User ID is required' });
    }

    const validation = validateUserInput(requestBody, true);
    if (!validation.valid) {
      return formatResponse(400, { errors: validation.errors });
    }

    const updateExpressions = [];
    const expressionValues = {};
    const expressionNames = {};

    if (requestBody.name) {
      updateExpressions.push('#name = :name');
      expressionNames['#name'] = 'name';
      expressionValues[':name'] = requestBody.name.trim();
    }

    if (requestBody.email) {
      updateExpressions.push('email = :email');
      expressionValues[':email'] = requestBody.email.trim().toLowerCase();
    }

    if (updateExpressions.length === 0) {
      return formatResponse(400, { error: 'No valid fields to update' });
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionValues[':updatedAt'] = new Date().toISOString();

    const result = await dynamodb.update({
      TableName: USERS_TABLE,
      Key: { id },
      UpdateExpression: 'SET ' + updateExpressions.join(', '),
      ExpressionAttributeValues: expressionValues,
      ExpressionAttributeNames: Object.keys(expressionNames).length > 0 ? expressionNames : undefined,
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(id)',
    });

    return formatResponse(200, result.Attributes);
  } catch (error) {
    console.error('Update Error:', error);
    
    if (error.name === 'ConditionalCheckFailedException') {
      return formatResponse(404, { error: 'User not found' });
    }
    return formatResponse(500, { error: 'Internal server error' });
  }
};

module.exports.delete = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return formatResponse(400, { error: 'User ID is required' });
    }

    await dynamodb.delete({
      TableName: USERS_TABLE,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
    });

    return formatResponse(200, { message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    
    if (error.name === 'ConditionalCheckFailedException') {
      return formatResponse(404, { error: 'User not found' });
    }
    return formatResponse(500, { error: 'Internal server error' });
  }
};