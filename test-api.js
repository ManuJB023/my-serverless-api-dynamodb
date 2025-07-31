const axios = require('axios');

const BASE_URL = 'http://localhost:3000/dev'; // Remove '/dev' if you updated serverless.yml

async function testAPI() {
  try {
    console.log('🚀 Testing Serverless API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test create user
    console.log('2. Creating a user...');
    const createResponse = await axios.post(`${BASE_URL}/users`, {
      name: 'John Doe',
      email: 'john@example.com'
    });
    console.log('✅ User created:', createResponse.data);
    const userId = createResponse.data.id;
    console.log('');

    // Test list users
    console.log('3. Listing all users...');
    const listResponse = await axios.get(`${BASE_URL}/users`);
    console.log('✅ Users list:', listResponse.data);
    console.log('');

    // Test get specific user
    console.log('4. Getting specific user...');
    const getUserResponse = await axios.get(`${BASE_URL}/users/${userId}`);
    console.log('✅ Get user:', getUserResponse.data);
    console.log('');

    // Test update user
    console.log('5. Updating user...');
    const updateResponse = await axios.put(`${BASE_URL}/users/${userId}`, {
      name: 'Jane Doe Updated'
    });
    console.log('✅ User updated:', updateResponse.data);
    console.log('');

    // Test delete user
    console.log('6. Deleting user...');
    const deleteResponse = await axios.delete(`${BASE_URL}/users/${userId}`);
    console.log('✅ User deleted:', deleteResponse.data);
    console.log('');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Full error:', error.code);
  }
}

// Install axios first: npm install axios
testAPI();