// handler.js - Fixed for AWS deployment
const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { ddbDocClient } = require("./db.js");

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

async function ensureTable() {
  // Only try to create table in AWS if it doesn't exist
  try {
    await dynamoDBClient.send(new DescribeTableCommand({
      TableName: process.env.DYNAMODB_TABLE
    }));
    console.log('✅ Table exists');
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      console.log('🔄 Creating table...');
      try {
        await dynamoDBClient.send(new CreateTableCommand({
          TableName: process.env.DYNAMODB_TABLE,
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST",
        }));
        console.log('✅ Table created successfully');
        
        // Wait for table to be active
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (createError) {
        console.log('Table creation error (might already exist):', createError.message);
      }
    } else {
      console.log('Table check error:', error.message);
    }
  }
}

module.exports.hello = async (event) => {
  console.log("Hello function called", new Date().toISOString());
  console.log("DynamoDB Table:", process.env.DYNAMODB_TABLE);
  console.log("Is Offline:", process.env.IS_OFFLINE);

  try {
    // Only ensure table exists in AWS (not needed for local)
    if (process.env.IS_OFFLINE !== "true") {
      await ensureTable();
    }

    // Write item
    await ddbDocClient.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          id: "123",
          message: "Hello from AWS SDK v3!",
          timestamp: Date.now(),
        },
      })
    );

    // Read item
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Key: { id: "123" },
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: "Success with AWS SDK v3!",
        item: result.Item,
        environment: process.env.IS_OFFLINE === "true" ? "local" : "aws",
        table: process.env.DYNAMODB_TABLE
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: "Database operation failed",
        message: error.message,
        table: process.env.DYNAMODB_TABLE
      }),
    };
  }
};