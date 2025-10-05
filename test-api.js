const axios = require('axios');
const { execSync } = require('child_process');

// Try to detect deployed endpoint dynamically (prod first, then fallback)
function getBaseUrl() {
  try {
    // Check prod deployment
    const info = execSync('npx serverless info --stage prod --verbose', { encoding: 'utf-8' });
    const match = info.match(/GET - (https:\/\/[a-z0-9]+\.execute-api\.[^/]+)\/health/);
    if (match) {
      return match[1]; // deployed base URL
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch deployed endpoint, falling back to localhost');
  }
  // Local serverless-offline usually runs at http://localhost:3000 with routes like /health
  return 'https://e3tkharr9a.execute-api.us-east-1.amazonaws.com';
}

const BASE_URL = getBaseUrl();

async function testAPI() {
  try {
    console.log(`🚀 Testing Serverless API at ${BASE_URL}\n`);

    // 1. Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data, '\n');

    // 2. Create user
    console.log('2. Creating a user...');
    const createResponse = await axios.post(`${BASE_URL}/users`, {
      name: 'John Doe',
      email: 'john@example.com'
    });
    console.log('✅ User created:', createResponse.data, '\n');
    const userId = createResponse.data.id;

    // 3. List users
    console.log('3. Listing all users...');
    const listResponse = await axios.get(`${BASE_URL}/users`);
    console.log('✅ Users list:', listResponse.data, '\n');

    // 4. Get user
    console.log('4. Getting specific user...');
    const getUserResponse = await axios.get(`${BASE_URL}/users/${userId}`);
    console.log('✅ Get user:', getUserResponse.data, '\n');

    // 5. Update user
    console.log('5. Updating user...');
    const updateResponse = await axios.put(`${BASE_URL}/users/${userId}`, {
      name: 'Jane Doe Updated'
    });
    console.log('✅ User updated:', updateResponse.data, '\n');

    // 6. Delete user
    console.log('6. Deleting user...');
    const deleteResponse = await axios.delete(`${BASE_URL}/users/${userId}`);
    console.log('✅ User deleted:', deleteResponse.data, '\n');

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Full error:', error.code);
  }
}

testAPI();
