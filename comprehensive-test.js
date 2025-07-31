const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const DEPLOYED_URL = process.env.DEPLOYED_URL || ''; // Set this for deployed API testing

class APITester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.createdUserIds = [];
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '📝',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️'
    }[type];
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async test(name, testFn) {
    try {
      this.log(`Testing: ${name}`);
      await testFn();
      this.testResults.passed++;
      this.log(`PASSED: ${name}`, 'success');
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push({ test: name, error: error.message });
      this.log(`FAILED: ${name} - ${error.message}`, 'error');
    }
  }

  async cleanup() {
    this.log('🧹 Cleaning up created test data...');
    for (const userId of this.createdUserIds) {
      try {
        await axios.delete(`${this.baseUrl}/users/${userId}`);
        this.log(`Deleted test user: ${userId}`, 'success');
      } catch (error) {
        this.log(`Failed to delete user ${userId}: ${error.message}`, 'warning');
      }
    }
  }

  async runAllTests() {
    this.log('🚀 Starting Comprehensive API Test Suite\n');

    // 1. Basic Connectivity Tests
    await this.test('Health Check Endpoint', async () => {
      const response = await axios.get(`${this.baseUrl}/health`);
      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (!response.data.message) throw new Error('Missing message in health response');
      if (!response.data.timestamp) throw new Error('Missing timestamp in health response');
    });

    // 2. Input Validation Tests
    await this.test('Create User - Missing Name', async () => {
      try {
        await axios.post(`${this.baseUrl}/users`, { email: 'test@example.com' });
        throw new Error('Should have failed with missing name');
      } catch (error) {
        if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
      }
    });

    await this.test('Create User - Missing Email', async () => {
      try {
        await axios.post(`${this.baseUrl}/users`, { name: 'Test User' });
        throw new Error('Should have failed with missing email');
      } catch (error) {
        if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
      }
    });

    await this.test('Create User - Invalid Email Format', async () => {
      try {
        await axios.post(`${this.baseUrl}/users`, { 
          name: 'Test User', 
          email: 'invalid-email' 
        });
        throw new Error('Should have failed with invalid email');
      } catch (error) {
        if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
      }
    });

    await this.test('Create User - Empty Name', async () => {
      try {
        await axios.post(`${this.baseUrl}/users`, { 
          name: '', 
          email: 'test@example.com' 
        });
        throw new Error('Should have failed with empty name');
      } catch (error) {
        if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
      }
    });

    // 3. CRUD Operations Tests
    let testUserId;
    await this.test('Create Valid User', async () => {
      const userData = {
        name: 'Test User ' + Date.now(),
        email: `test${Date.now()}@example.com`
      };
      const response = await axios.post(`${this.baseUrl}/users`, userData);
      
      if (response.status !== 201) throw new Error(`Expected 201, got ${response.status}`);
      if (!response.data.id) throw new Error('Missing user ID in response');
      if (response.data.name !== userData.name) throw new Error('Name mismatch in response');
      if (response.data.email !== userData.email) throw new Error('Email mismatch in response');
      if (!response.data.createdAt) throw new Error('Missing createdAt timestamp');
      if (!response.data.updatedAt) throw new Error('Missing updatedAt timestamp');
      
      testUserId = response.data.id;
      this.createdUserIds.push(testUserId);
    });

    await this.test('Get User by ID', async () => {
      const response = await axios.get(`${this.baseUrl}/users/${testUserId}`);
      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (response.data.id !== testUserId) throw new Error('User ID mismatch');
    });

    await this.test('List Users', async () => {
      const response = await axios.get(`${this.baseUrl}/users`);
      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (!Array.isArray(response.data.users)) throw new Error('Users should be an array');
      if (typeof response.data.count !== 'number') throw new Error('Count should be a number');
      
      const userExists = response.data.users.some(user => user.id === testUserId);
      if (!userExists) throw new Error('Created user not found in list');
    });

    await this.test('Update User', async () => {
      const updateData = { name: 'Updated Test User ' + Date.now() };
      const response = await axios.put(`${this.baseUrl}/users/${testUserId}`, updateData);
      
      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (response.data.name !== updateData.name) throw new Error('Name not updated correctly');
      if (!response.data.updatedAt) throw new Error('Missing updatedAt timestamp');
    });

    await this.test('Update User - No Fields', async () => {
      try {
        await axios.put(`${this.baseUrl}/users/${testUserId}`, {});
        throw new Error('Should have failed with no update fields');
      } catch (error) {
        if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
      }
    });

    // 4. Error Handling Tests
    await this.test('Get Non-existent User', async () => {
      const fakeId = 'non-existent-id';
      try {
        await axios.get(`${this.baseUrl}/users/${fakeId}`);
        throw new Error('Should have failed with 404');
      } catch (error) {
        if (error.response?.status !== 404) throw new Error(`Expected 404, got ${error.response?.status}`);
      }
    });

    await this.test('Update Non-existent User', async () => {
      const fakeId = 'non-existent-id';
      try {
        await axios.put(`${this.baseUrl}/users/${fakeId}`, { name: 'Test' });
        throw new Error('Should have failed with 404');
      } catch (error) {
        if (error.response?.status !== 404) throw new Error(`Expected 404, got ${error.response?.status}`);
      }
    });

    await this.test('Delete Non-existent User', async () => {
      const fakeId = 'non-existent-id';
      try {
        await axios.delete(`${this.baseUrl}/users/${fakeId}`);
        throw new Error('Should have failed with 404');
      } catch (error) {
        if (error.response?.status !== 404) throw new Error(`Expected 404, got ${error.response?.status}`);
      }
    });

    // 5. Edge Cases
    await this.test('Create User - Long Name', async () => {
      const longName = 'A'.repeat(150); // Exceeds typical limits
      const userData = {
        name: longName,
        email: `longname${Date.now()}@example.com`
      };
      
      try {
        const response = await axios.post(`${this.baseUrl}/users`, userData);
        // If it succeeds, that's fine - just check the response
        if (response.status === 201) {
          this.createdUserIds.push(response.data.id);
        }
      } catch (error) {
        // If it fails with validation error, that's also acceptable
        if (error.response?.status !== 400) {
          throw new Error(`Expected 201 or 400, got ${error.response?.status}`);
        }
      }
    });

    await this.test('Create User - Unicode Characters', async () => {
      const userData = {
        name: '测试用户 José María',
        email: `unicode${Date.now()}@example.com`
      };
      const response = await axios.post(`${this.baseUrl}/users`, userData);
      if (response.status !== 201) throw new Error(`Expected 201, got ${response.status}`);
      this.createdUserIds.push(response.data.id);
    });

    // 6. Delete Test (after all other tests)
    await this.test('Delete User', async () => {
      const response = await axios.delete(`${this.baseUrl}/users/${testUserId}`);
      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      
      // Remove from cleanup list since we just deleted it
      this.createdUserIds = this.createdUserIds.filter(id => id !== testUserId);
      
      // Verify it's actually deleted
      try {
        await axios.get(`${this.baseUrl}/users/${testUserId}`);
        throw new Error('User should have been deleted');
      } catch (error) {
        if (error.response?.status !== 404) throw new Error('Deleted user should return 404');
      }
    });

    // 7. Stress Test (Light)
    await this.test('Create Multiple Users Quickly', async () => {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          axios.post(`${this.baseUrl}/users`, {
            name: `Stress Test User ${i}`,
            email: `stress${i}${Date.now()}@example.com`
          })
        );
      }
      
      const responses = await Promise.all(promises);
      responses.forEach(response => {
        if (response.status !== 201) throw new Error(`Expected 201, got ${response.status}`);
        this.createdUserIds.push(response.data.id);
      });
    });

    // Cleanup
    await this.cleanup();

    // Results
    this.log('\n📊 Test Results Summary:');
    this.log(`✅ Passed: ${this.testResults.passed}`);
    this.log(`❌ Failed: ${this.testResults.failed}`);
    
    if (this.testResults.failed > 0) {
      this.log('\n🚨 Failed Tests:');
      this.testResults.errors.forEach(error => {
        this.log(`  • ${error.test}: ${error.error}`, 'error');
      });
    }

    const totalTests = this.testResults.passed + this.testResults.failed;
    const successRate = ((this.testResults.passed / totalTests) * 100).toFixed(1);
    this.log(`\n📈 Success Rate: ${successRate}%`);

    if (this.testResults.failed === 0) {
      this.log('\n🎉 All tests passed! Your API is ready for production.', 'success');
    } else {
      this.log('\n⚠️  Some tests failed. Please review and fix before deploying.', 'warning');
    }

    return this.testResults.failed === 0;
  }
}

// Main execution
async function main() {
  console.log('🔍 Comprehensive API Testing Suite');
  console.log('=====================================\n');

  // Test local development server
  if (!process.env.SKIP_LOCAL) {
    console.log('🏠 Testing Local Development Server...');
    const localTester = new APITester('http://localhost:3000');
    try {
      await localTester.runAllTests();
    } catch (error) {
      console.error('❌ Local testing failed:', error.message);
      console.log('💡 Make sure your local server is running: npm start');
    }
  }

  // Test deployed API if URL provided
  if (DEPLOYED_URL) {
    console.log('\n☁️  Testing Deployed API...');
    const deployedTester = new APITester(DEPLOYED_URL);
    try {
      await deployedTester.runAllTests();
    } catch (error) {
      console.error('❌ Deployed API testing failed:', error.message);
    }
  }

  console.log('\n✨ Testing completed!');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { APITester };