# Kube Credential System

A microservice-based digital credential issuance and verification system built with Node.js, React, and PostgreSQL.

---

## 👨‍💻 Developer Information

**Name:** Buthuru Venkat Reddy  
**Email:** buthuruvenkatreddy@gmail.com  
**Phone:** +91 6302561651  
**GitHub:** https://github.com/buthuruvenkatareddy  
**Repository:** https://github.com/buthuruvenkatareddy/Kubernetes-project

---

## 🌐 Live Application

### ⚠️ Important: Wake Up Services First

Render.com free tier services sleep after 15 minutes. You MUST wake up backend services first:

1. **Issuance Service:** https://kube-credential-issuance.onrender.com/
   - Click and wait 30-60 seconds for service to wake up

2. **Verification Service:** https://kube-credential-verification.onrender.com/
   - Click and wait 30-60 seconds for service to wake up

3. **Frontend Application:** https://kube-credential-frontend.onrender.com/
   - Use ONLY after backend services are awake

---

## 📖 Project Overview

This system allows organizations to:
- **Issue Digital Credentials** - Create verifiable credentials with unique IDs
- **Verify Credentials** - Check credential authenticity and validity
- **Manage Data** - Store credential information securely in PostgreSQL

### Architecture Components
- **Issuance Service** - Issues credentials and stores them in PostgreSQL
- **Verification Service** - Verifies credentials by checking with Issuance Service
- **React Frontend** - User-friendly web interface for both operations

---

## 🔄 System Flow

```
User Interface → React Frontend → Backend Services → PostgreSQL Database
```

### Credential Issuance Flow
```
User fills form → Frontend sends data → Issuance Service → Store in Database → Return unique ID
```

### Credential Verification Flow
```
User enters ID → Frontend → Verification Service → Query Issuance Service → Check Database → Return result
```

---

## 💻 Technology Stack

- **Backend:** Node.js 18 + TypeScript + Express.js
- **Database:** PostgreSQL (migrated from SQLite)
- **Frontend:** React 18 + TypeScript + Material-UI
- **Deployment:** Render.com cloud platform
- **Containerization:** Docker & Docker Compose
- **Version Control:** Git & GitHub

---

## 📁 Project Structure

```
Kube Credential/
├── backend/
│   ├── issuance-service/          # Issues credentials
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── verification-service/      # Verifies credentials
│       ├── src/
│       ├── package.json
│       └── Dockerfile
├── frontend/                      # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── Kube_Screenshots/             # Service output screenshots
│   ├── 1.png
│   └── 2.png
├── docker-compose.yml            # Multi-service Docker setup
├── render.yaml                   # Render.com deployment config
└── README.md
```

---

## 🖼️ Screenshots

### Issuance Service Output
![Issuance Service Output](./Kube_Screenshots/1.png)

### Verification Service Output
![Verification Service Output](./Kube_Screenshots/2.png)

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose
```bash
# Clone repository
git clone https://github.com/buthuruvenkatareddy/Kubernetes-project.git
cd "Kube Credential"

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Services Configuration
- **PostgreSQL Database** - Port 5432
- **Issuance Service** - Port 3001
- **Verification Service** - Port 3002
- **Frontend Application** - Port 3000

### Individual Docker Commands
```bash
# Build images
docker build -t kube-issuance ./backend/issuance-service
docker build -t kube-verification ./backend/verification-service  
docker build -t kube-frontend ./frontend

# Run containers
docker run -p 3001:3001 kube-issuance
docker run -p 3002:3002 kube-verification
docker run -p 3000:3000 kube-frontend
```

---

## 🧪 Testing

### Unit Tests
```bash
# Test Issuance Service
cd backend/issuance-service
npm test

# Test Verification Service
cd backend/verification-service
npm test

# Test Frontend
cd frontend
npm test
```

### Manual API Testing
```bash
# Test service health
curl http://localhost:3001/health  # Issuance service
curl http://localhost:3002/health  # Verification service

# Test credential issuance
curl -X POST http://localhost:3001/api/credentials/issue \
  -H "Content-Type: application/json" \
  -d '{"subject":"test@example.com","issuer":"Test Org","credentialType":"TestCred","claims":{"name":"Test User"}}'
```

### Test Coverage Areas
- API endpoint functionality
- Database operations
- Input validation
- Service-to-service communication
- Error handling and edge cases

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker (optional but recommended)

### Manual Setup
```bash
# Install dependencies for all services
cd backend/issuance-service && npm install
cd ../verification-service && npm install
cd ../../frontend && npm install

# Set up environment variables (see .env.example files)
# Start PostgreSQL database
# Run each service in development mode
npm run dev  # In each service directory
```

### Environment Variables
Each service requires specific environment variables for database connection, API URLs, and service configuration. Check the `.env.example` files in each service directory.

---

## 🌟 Key Features

- ✅ Issue digital credentials with unique identifiers
- ✅ Verify credential authenticity in real-time
- ✅ Secure PostgreSQL database storage
- ✅ Responsive Material-UI interface
- ✅ RESTful API design
- ✅ Docker containerization support
- ✅ Cloud deployment on Render.com
- ✅ TypeScript for type safety
- ✅ Microservices architecture

---

## 🚀 Quick Start Guide

```bash
# 1. Clone the repository
git clone https://github.com/buthuruvenkatareddy/Kubernetes-project.git
cd "Kube Credential"

# 2. Start with Docker (recommended)
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Issuance API: http://localhost:3001
# Verification API: http://localhost:3002

# 4. Test the services
# Issue a credential through the web interface
# Verify the credential using the returned ID
```

---

## 📞 Contact & Support

**Developer:** Buthuru Venkat Reddy  
**Email:** buthuruvenkatreddy@gmail.com  
**Phone:** +91 6302561651  
**GitHub Profile:** https://github.com/buthuruvenkatareddy  
**Project Repository:** https://github.com/buthuruvenkatareddy/Kubernetes-project

For questions, issues, or contributions, please contact me or create an issue in the GitHub repository.

---

*Built with ❤️ using modern web technologies*