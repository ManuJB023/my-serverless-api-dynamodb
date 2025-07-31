# Serverless API with DynamoDB

A production-ready serverless REST API built with the Serverless Framework, AWS Lambda, API Gateway, and DynamoDB. This project demonstrates modern serverless architecture patterns and CLI-driven development workflows.

## 🚀 Features

- **Full CRUD Operations** - Create, Read, Update, Delete users
- **Serverless Architecture** - Auto-scaling, pay-per-use AWS Lambda functions
- **DynamoDB Integration** - NoSQL database with global secondary indexes
- **Input Validation** - Comprehensive request validation and error handling
- **Health Monitoring** - Built-in health check endpoint
- **Multiple Environments** - Support for dev/staging/production deployments
- **Local Development** - Offline development with serverless-offline
- **ARM64 Optimized** - Uses ARM64 architecture for better performance and cost

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Gateway   │───▶│   AWS Lambda     │───▶│    DynamoDB     │
│                 │    │                  │    │                 │
│ • Rate Limiting │    │ • Node.js 18.x   │    │ • Pay-per-use   │
│ • CORS Enabled  │    │ • ARM64          │    │ • GSI on email  │
│ • JSON Schema   │    │ • Auto-scaling   │    │ • Encryption    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `POST` | `/users` | Create a new user |
| `GET` | `/users` | List all users (max 100) |
| `GET` | `/users/{id}` | Get user by ID |
| `PUT` | `/users/{id}` | Update user by ID |
| `DELETE` | `/users/{id}` | Delete user by ID |

## 🛠️ Tech Stack

- **Runtime**: Node.js 18.x on AWS Lambda (ARM64)
- **Framework**: Serverless Framework v4
- **Database**: Amazon DynamoDB
- **API**: AWS API Gateway (HTTP API)
- **Infrastructure**: AWS CloudFormation
- **Development**: Serverless Offline
- **Dependencies**: AWS SDK v3, UUID

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate permissions
- [Serverless Framework](https://www.serverless.com/) installed globally

```bash
# Install Serverless Framework globally
npm install -g serverless

# Verify installation
serverless --version
```

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/serverless-api-dynamodb.git
cd serverless-api-dynamodb
npm install
```

### 2. Configure AWS Credentials

```bash
# Configure AWS CLI (if not already done)
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_access_key
export AWS_DEFAULT_REGION=us-east-1
```

### 3. Local Development

```bash
# Start local development server
npm start

# The API will be available at http://localhost:3000
```

### 4. Deploy to AWS

```bash
# Deploy to development environment
npm run deploy:dev

# Deploy to production environment
npm run deploy:prod

# Deploy with custom stage and region
serverless deploy --stage staging --region eu-west-1
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/health

# Create a user
curl -X POST https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# List all users
curl https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/users

# Get specific user
curl https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/users/{user-id}

# Update user
curl -X PUT https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/users/{user-id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'

# Delete user
curl -X DELETE https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/users/{user-id}
```

### Using the Test Script

```bash
# Run the automated test script (requires local server)
node test-api.js
```

## 📊 Request/Response Examples

### Create User Request
```json
POST /users
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Create User Response
```json
{
  "id": "ec5ba4fc-8b09-4878-84f9-a8df2aa6d906",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-07-31T18:11:27.283Z",
  "updatedAt": "2025-07-31T18:11:27.283Z"
}
```

### List Users Response
```json
{
  "users": [
    {
      "id": "ec5ba4fc-8b09-4878-84f9-a8df2aa6d906",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-07-31T18:11:27.283Z",
      "updatedAt": "2025-07-31T18:11:27.283Z"
    }
  ],
  "count": 1
}
```

## 🔧 Available Scripts

```bash
npm start          # Start local development server
npm run deploy     # Deploy to default stage (dev)
npm run deploy:dev # Deploy to development
npm run deploy:prod# Deploy to production
npm run remove     # Remove the entire stack
npm run logs       # View function logs
npm run info       # Display service information
```

## 🏗️ Project Structure

```
├── handlers/              # Lambda function handlers
│   ├── health.js         # Health check endpoint
│   └── users.js          # User CRUD operations
├── schemas/              # JSON Schema validation
│   ├── create-user.json  # Create user validation
│   └── update-user.json  # Update user validation
├── test-api.js           # API testing script
├── serverless.yml        # Serverless configuration
├── package.json          # Node.js dependencies
└── README.md            # Project documentation
```

## 🔒 Security Features

- **Input Validation**: JSON Schema validation for all inputs
- **Error Handling**: Comprehensive error responses
- **CORS**: Cross-Origin Resource Sharing enabled
- **DynamoDB Encryption**: Server-side encryption enabled
- **IAM Roles**: Least-privilege access patterns
- **Condition Expressions**: Prevent race conditions

## 🌍 Environment Configuration

The API supports multiple deployment environments:

```bash
# Development (default)
serverless deploy --stage dev

# Staging
serverless deploy --stage staging

# Production
serverless deploy --stage prod
```

Each environment gets its own:
- DynamoDB table (`service-stage-users`)
- Lambda functions
- API Gateway endpoint
- CloudFormation stack

## 📈 Performance Optimizations

- **ARM64 Architecture**: ~20% better price-performance
- **Provisioned Concurrency**: Configure for production workloads
- **Connection Reuse**: AWS SDK v3 with optimized connections
- **Memory Optimization**: Right-sized memory allocation per function
- **DynamoDB**: On-demand billing mode for automatic scaling

## 🚨 Error Handling

The API provides comprehensive error responses:

```json
// Validation Error (400)
{
  "errors": ["Name is required", "Invalid email format"]
}

// Not Found (404)
{
  "error": "User not found"
}

// Conflict (409)
{
  "error": "Email already exists"
}

// Server Error (500)
{
  "error": "Internal server error"
}
```

## 🔍 Monitoring and Debugging

```bash
# View real-time logs
serverless logs -f createUser -t

# Get service information
serverless info

# Debug deployment issues
serverless deploy --verbose
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Troubleshooting

### Common Issues

**Deployment Fails**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify permissions
aws iam get-user
```

**Local Development Issues**
```bash
# Clear serverless cache
serverless --help

# Restart with clean state
rm -rf .serverless && npm start
```

**DynamoDB Access Issues**
- Ensure your AWS user has DynamoDB permissions
- Check the IAM role statements in `serverless.yml`

## 📚 Additional Resources

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/latest/developerguide/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)

---

**Built with ❤️ using the Serverless Framework**