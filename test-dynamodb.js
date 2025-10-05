import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
});

async function testDynamo() {
  try {
    const result = await client.send(new ListTablesCommand({}));
    console.log('✅ DynamoDB Local is working! Tables:', result.TableNames);
    return true;
  } catch (error) {
    console.log('❌ DynamoDB Local connection failed:', error.message);
    return false;
  }
}

testDynamo();