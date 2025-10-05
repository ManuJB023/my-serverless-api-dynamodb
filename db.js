// db.js - Works for both local and AWS
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const isOffline = process.env.IS_OFFLINE === "true";

const clientConfig = isOffline 
  ? {
      // Local development
      region: "localhost",
      endpoint: "http://localhost:8000",
      credentials: {
        accessKeyId: "fake",
        secretAccessKey: "fake",
      },
    }
  : {
      // AWS production - uses IAM roles or environment variables
      region: process.env.AWS_REGION || "us-east-1",
    };

const client = new DynamoDBClient(clientConfig);

const ddbDocClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

module.exports = { ddbDocClient };