# 🚀 Serverless API with DynamoDB

A complete **Serverless Framework** template for building AWS Lambda REST APIs with Amazon DynamoDB.  
It supports **local development with DynamoDB Local** and **production-ready AWS deployment**, using the modern **AWS SDK v3** for JavaScript.

---

## ✨ Features

- **Full CRUD Support** – Create, Read, Update, Delete users  
- **Local Development** – Full DynamoDB Local + Serverless Offline integration  
- **AWS Deployment** – One-command deployment to AWS with IAM permissions  
- **Modern AWS SDK v3** – Future-proof client with optimized connections  
- **Cross-Platform** – Works on Windows, Mac, Linux  
- **Error Handling & Validation** – JSON schema validation, CORS, detailed error responses  
- **Health Monitoring** – Built-in health check endpoint  
- **Performance Optimized** – ARM64 runtime, connection reuse, on-demand DynamoDB billing  
- **Cost-Effective** – Pay-per-use pricing, easy cleanup commands  
- **Production Ready** – Security best practices, IAM least privilege, DynamoDB encryption  

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Gateway   │───▶│   AWS Lambda     │───▶│    DynamoDB     │
│                 │    │                  │    │                 │
│ • CORS Enabled  │    │ • Node.js 20.x   │    │ • On-Demand     │
│ • JSON Schema   │    │ • AWS SDK v3     │    │ • GSI Support   │
│ • Rate Limiting │    │ • Auto-scaling   │    │ • Encryption    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 📋 Prerequisites

- [Node.js 20.x LTS](https://nodejs.org/)  
- [Java Runtime](https://www.java.com/) (required for DynamoDB Local)  
- [AWS Account](https://aws.amazon.com/free) + IAM user/role with DynamoDB + Lambda permissions  
- [Serverless Framework](https://www.serverless.com/) installed globally  
- [AWS CLI](https://aws.amazon.com/cli/) (optional for credentials setup)  

---

## 🛠️ Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd my-serverless-api

# Install dependencies
npm install

# Install DynamoDB Local
npm run dynamodb:install
```

---

## 🏃 Quick Start

### Local Development

```bash
# Start API + DynamoDB Local
npm start
```

👉 Available at: `http://localhost:3000/dev/hello`  
👉 DynamoDB Shell: `http://localhost:8000/shell`

**Manual startup:**

```bash
npm run dynamodb:start   # Terminal 1
npm run offline          # Terminal 2
```

### Deploy to AWS

```bash
npm run deploy:dev   # Development
npm run deploy:prod  # Production
```

Example endpoint:  
`https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/hello`

---

## 🌐 API Endpoints

| Method   | Endpoint              | Description           |
|----------|-----------------------|-----------------------|
| `GET`    | `/health`             | Health check |
| `GET`    | `/hello`              | Sample hello handler |
| `POST`   | `/users`              | Create new user |
| `GET`    | `/users`              | List users (max 100) |
| `GET`    | `/users/{id}`         | Get user by ID |
| `PUT`    | `/users/{id}`         | Update user by ID |
| `DELETE` | `/users/{id}`         | Delete user by ID |

---

## 📊 Example Response

```json
{
  "message": "Success with AWS SDK v3!",
  "item": {
    "id": "123",
    "message": "Hello from AWS SDK v3!",
    "timestamp": 1759556356004
  },
  "environment": "local",
  "table": "myTable-dev"
}
```

---

## 📁 Project Structure

```
my-serverless-api/
├── .dynamodb/              # DynamoDB Local
├── handler.js              # Lambda handlers
├── db.js                   # DynamoDB client config
├── schemas/                # JSON schema validation
├── serverless.yml          # Serverless config
├── package.json            # Dependencies & scripts
├── test-dynamo.js          # DynamoDB connection test
├── test-api.js             # API test script
└── README.md               # Documentation
```

---

## 🔧 Scripts Reference

| Command              | Description |
|-----------------------|-------------|
| `npm start`           | Start local dev (DynamoDB + Offline) |
| `npm run dev`         | Same as above |
| `npm run dynamodb:start` | Start DynamoDB Local only |
| `npm run offline`     | Start Serverless Offline only |
| `npm run deploy:dev`  | Deploy to development |
| `npm run deploy:prod` | Deploy to production |
| `npm run remove:dev`  | Remove dev stack |
| `npm run logs:dev`    | View development logs |
| `npm run logs:prod`   | View production logs |

---

## 🔒 Security & Best Practices

- **Never commit AWS credentials** – use environment variables or IAM roles  
- **IAM least privilege** – functions limited to required DynamoDB actions  
- **Server-side encryption** – DynamoDB encryption enabled  
- **JSON schema validation** – prevents invalid payloads  
- **Regular credential rotation** – recommended for security  

---

## 📈 Performance & Cost Optimization

- **ARM64 Lambda runtime** (~20% better price-performance)  
- **DynamoDB On-Demand** – scales automatically  
- **Connection reuse** with AWS SDK v3  
- **Estimated AWS Costs**:  
  - API Gateway: ~$3.50 per million requests  
  - Lambda: ~$0.20 per million requests  
  - DynamoDB: ~$1.25 per GB-month  

---

## 🧪 Testing

```bash
# Test DynamoDB connection
node test-dynamo.js

# Test handler locally
node test-handler.js

# Run API tests (requires server running)
node test-api.js
```

---

## 🔍 Troubleshooting

**Port already in use (8000/3000)**  
```bash
npx kill-port 8000 3000
```

**AWS Permission Errors**  
- Verify IAM roles in `serverless.yml`  
- Run: `aws sts get-caller-identity` to confirm credentials  

**DynamoDB Local Issues**  
- Ensure Java is installed (`java -version`)  
- Restart with `npm run dynamodb:start`

---

## 🔥 AWS Resources Cleanup (Important!)

To avoid **unwanted AWS charges**, remove your stacks after testing:

```bash
# Check what scripts are available
npm run

# Typically, you'll have:
npm run remove        # Remove dev stack
npm run remove:prod   # Remove production stack

# Or use the specific command
npx serverless remove --stage dev
```

---

## 🛠️ Complete Setup Verification

```bash
# 1. Verify Node.js installation
node --version  # Should be v18 or higher

# 2. Verify npm
npm --version

# 3. Install Serverless Framework
npm install -g serverless@4

# 4. Verify installation
serverless --version  # Should show v4.x.x

# 5. Now remove the stack
serverless remove --stage dev

# 6. Verify removal
serverless info --stage dev  # Should show stack not found
```

---

## 🤝 Contributing

1. Fork this repo  
2. Create a branch (`git checkout -b feature/amazing`)  
3. Commit changes  
4. Push branch and open PR  

---
## Author: Manuel Bauka

---

## 📄 License

MIT License © 2025  
