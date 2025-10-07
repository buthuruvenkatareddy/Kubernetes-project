# Kube Credential System

A microservice-based credential issuance and verification system built with Node.js (TypeScript) backend services and React (TypeScript) frontend, containerized with Docker and deployable on Kubernetes.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [API Documentation](#api-documentation)
- [Frontend Usage](#frontend-usage)
- [Testing](#testing)
- [Design Decisions](#design-decisions)
- [Assumptions](#assumptions)
- [Cloud Deployment](#cloud-deployment)
- [Contact Information](#contact-information)

## 🎯 Project Overview

The Kube Credential System is a microservice architecture that provides:

1. **Credential Issuance Service**: Issues digital credentials with unique IDs and worker tracking
2. **Credential Verification Service**: Verifies the authenticity of issued credentials
3. **React Frontend**: User-friendly interface for both credential issuance and verification

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │ Issuance Service│    │Verification Svc │
│     (Port 3000)  │◄──►│   (Port 3001)   │◄──►│   (Port 3002)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                │                        │
                         ┌─────────────┐          ┌─────────────┐
                         │   SQLite    │          │  HTTP API   │
                         │  Database   │          │   Calls     │
                         └─────────────┘          └─────────────┘
```

### Microservice Communication
- **Frontend ↔ Services**: HTTP REST API calls
- **Verification ↔ Issuance**: HTTP API calls for credential lookup
- **Data Persistence**: SQLite database for issuance service
- **Load Balancing**: Kubernetes services with multiple replicas

## ✨ Features

### Credential Issuance
- ✅ Issue new credentials with unique UUIDs
- ✅ Prevent duplicate credential issuance
- ✅ Worker ID tracking for load balancing
- ✅ JSON-based credential attributes
- ✅ Timestamp tracking
- ✅ Input validation with Joi schema
- ✅ SQLite persistence

### Credential Verification
- ✅ Verify credentials by ID
- ✅ Real-time validation status
- ✅ Worker ID tracking for verification
- ✅ Expiration date checking
- ✅ Cross-service communication
- ✅ Detailed verification results

### Frontend Interface
- ✅ Responsive Material-UI design
- ✅ Separate pages for issuance and verification
- ✅ Real-time API communication
- ✅ Error handling and user feedback
- ✅ Form validation
- ✅ Success/failure status indicators

### DevOps & Deployment
- ✅ Docker containerization
- ✅ Kubernetes deployment manifests
- ✅ Health checks and monitoring
- ✅ Load balancing configuration
- ✅ Ingress routing
- ✅ Environment-based configuration

## 🛠 Technology Stack

### Backend Services
- **Runtime**: Node.js 18
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite3
- **Validation**: Joi
- **HTTP Client**: Axios
- **Security**: Helmet, CORS
- **Testing**: Jest, Supertest
- **Container**: Docker

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App
- **Container**: Docker with Nginx

### Infrastructure
- **Orchestration**: Kubernetes
- **Container Registry**: Docker Hub (or any registry)
- **Reverse Proxy**: Nginx Ingress
- **Development**: Docker Compose

## 📁 Project Structure

```
kube-credential/
├── backend/
│   ├── issuance-service/
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   ├── database.ts
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── validation.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── verification-service/
│       ├── src/
│       │   ├── __tests__/
│       │   ├── index.ts
│       │   ├── types.ts
│       │   ├── validation.ts
│       │   └── verification.ts
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── k8s/
│   ├── issuance-deployment.yaml
│   ├── verification-deployment.yaml
│   └── ingress.yaml
├── docker-compose.yml
└── README.md
```

## 🔧 Prerequisites

- **Node.js** 18.x or higher
- **npm** 8.x or higher
- **Docker** 20.x or higher
- **Docker Compose** 2.x or higher
- **Kubernetes** cluster (for K8s deployment)
- **kubectl** configured for your cluster

## 🚀 Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd kube-credential

# Install backend dependencies
cd backend/issuance-service
npm install
cd ../verification-service
npm install

# Install frontend dependencies
cd ../../frontend
npm install
```

### 2. Start Services Individually

```bash
# Terminal 1: Start Issuance Service
cd backend/issuance-service
npm run dev

# Terminal 2: Start Verification Service
cd backend/verification-service
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm start
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Issuance API**: http://localhost:3001
- **Verification API**: http://localhost:3002

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for Development)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build issuance service
cd backend/issuance-service
docker build -t kube-credential/issuance-service .

# Build verification service
cd ../verification-service
docker build -t kube-credential/verification-service .

# Build frontend
cd ../../frontend
docker build -t kube-credential/frontend .
```

## ☸️ Kubernetes Deployment

### 1. Build and Push Images

```bash
# Tag and push to your registry
docker tag kube-credential/issuance-service:latest your-registry/issuance-service:latest
docker tag kube-credential/verification-service:latest your-registry/verification-service:latest

docker push your-registry/issuance-service:latest
docker push your-registry/verification-service:latest
```

### 2. Deploy to Kubernetes

```bash
# Apply deployments
kubectl apply -f k8s/issuance-deployment.yaml
kubectl apply -f k8s/verification-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods
kubectl get services
kubectl get ingress

# View logs
kubectl logs -l app=issuance-service
kubectl logs -l app=verification-service
```

### 3. Access the Application

```bash
# Port forward for local access
kubectl port-forward service/issuance-service 3001:3001
kubectl port-forward service/verification-service 3002:3002

# Or configure ingress hostname in /etc/hosts
echo "127.0.0.1 kube-credential.localhost" >> /etc/hosts
```

## 📚 API Documentation

### Issuance Service (Port 3001)

#### POST /api/credentials/issue
Issue a new credential.

**Request Body:**
```json
{
  "holderName": "John Doe",
  "issuerName": "University of Technology",
  "credentialType": "Bachelor's Degree",
  "issuanceDate": "2023-06-15T00:00:00.000Z",
  "expirationDate": "2027-06-15T00:00:00.000Z",
  "attributes": {
    "degree": "Computer Science",
    "gpa": "3.8",
    "honors": "Magna Cum Laude"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "credential issued by worker-1",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "holderName": "John Doe",
    "issuerName": "University of Technology",
    "credentialType": "Bachelor's Degree",
    "issuanceDate": "2023-06-15T00:00:00.000Z",
    "expirationDate": "2027-06-15T00:00:00.000Z",
    "attributes": {
      "degree": "Computer Science",
      "gpa": "3.8",
      "honors": "Magna Cum Laude"
    },
    "workerId": "worker-1",
    "timestamp": "2023-07-01T10:00:00.000Z"
  }
}
```

#### GET /api/credentials/:id
Retrieve a credential by ID.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Credential retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "holderName": "John Doe",
    "workerId": "worker-1",
    "timestamp": "2023-07-01T10:00:00.000Z"
  }
}
```

#### GET /health
Health check endpoint.

### Verification Service (Port 3002)

#### POST /api/credentials/verify
Verify a credential by ID.

**Request Body:**
```json
{
  "credentialId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "credential verified by verifier-1",
  "data": {
    "isValid": true,
    "credential": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "holderName": "John Doe",
      "workerId": "worker-1",
      "timestamp": "2023-07-01T10:00:00.000Z"
    },
    "workerId": "worker-1",
    "timestamp": "2023-07-01T10:00:00.000Z",
    "verifiedBy": "verifier-1",
    "verificationTimestamp": "2023-07-01T11:00:00.000Z"
  }
}
```

#### GET /api/credentials/verify/:id
Verify credential by ID in URL.

#### GET /health
Health check endpoint.

## 🖥 Frontend Usage

### Credential Issuance Page (`/issue`)
1. **Navigation**: Click "Issue Credential" in the navigation bar
2. **Form Fields**:
   - Holder Name (required)
   - Issuer Name (required)
   - Credential Type (required)
   - Institution
   - Issuance Date (required)
   - Expiration Date (optional)
   - Degree/Program
   - GPA (optional)
   - Additional Attributes (JSON format)
3. **Submit**: Click "Issue Credential" button
4. **Result**: View success message with credential details and worker ID

### Credential Verification Page (`/verify`)
1. **Navigation**: Click "Verify Credential" in the navigation bar
2. **Input**: Enter the credential ID to verify
3. **Submit**: Click "Verify" button
4. **Result**: 
   - ✅ **Valid**: Shows credential details, issuer info, and verification status
   - ❌ **Invalid**: Shows error message and verification timestamp

## 🧪 Testing

### Backend Testing

```bash
# Run tests for issuance service
cd backend/issuance-service
npm test
npm run test:coverage

# Run tests for verification service
cd backend/verification-service
npm test
npm run test:coverage
```

### Frontend Testing

```bash
# Run frontend tests
cd frontend
npm test
npm run test:coverage
```

### Integration Testing

```bash
# Test with Docker Compose
docker-compose up -d
# Run your integration tests here
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## 💡 Design Decisions

### 1. **Microservice Architecture**
- **Decision**: Separate services for issuance and verification
- **Rationale**: Independent scaling, fault isolation, technology flexibility
- **Trade-off**: Increased complexity vs. scalability benefits

### 2. **SQLite Database**
- **Decision**: SQLite for credential storage
- **Rationale**: Simple setup, sufficient for demo, easy backup
- **Production Alternative**: PostgreSQL or MongoDB for multi-instance deployments

### 3. **Worker ID Tracking**
- **Decision**: Include worker/pod ID in responses
- **Rationale**: Meets requirement for load balancing transparency
- **Implementation**: Environment variable with pod name fallback

### 4. **TypeScript Throughout**
- **Decision**: TypeScript for both frontend and backend
- **Rationale**: Type safety, better developer experience, requirement compliance
- **Benefit**: Reduced runtime errors, better IDE support

### 5. **Material-UI Frontend**
- **Decision**: MUI component library
- **Rationale**: Professional appearance, responsive design, rapid development
- **Alternative**: Could use styled-components or vanilla CSS

### 6. **Kubernetes-First Design**
- **Decision**: Kubernetes manifests with health checks
- **Rationale**: Production-ready deployment, auto-scaling, service discovery
- **Configuration**: Separate deployments for independent scaling

## 📝 Assumptions

### 1. **Credential Uniqueness**
- **Assumption**: Credentials are unique by (holderName + issuerName + credentialType)
- **Rationale**: Prevents duplicate degrees from same institution
- **Impact**: Business logic for duplication prevention

### 2. **Network Connectivity**
- **Assumption**: Verification service can reach issuance service
- **Implementation**: Kubernetes service discovery or environment variables
- **Fallback**: Health checks and error handling

### 3. **Data Persistence**
- **Assumption**: Data persistence not required across container restarts for demo
- **Production Note**: Would use persistent volumes or external database
- **Current**: Local SQLite file

### 4. **Security Requirements**
- **Assumption**: Basic security sufficient for demo
- **Implementation**: CORS, Helmet, input validation
- **Production Enhancement**: Authentication, authorization, TLS, rate limiting

### 5. **Load Testing**
- **Assumption**: Basic load balancing demonstration sufficient
- **Implementation**: Multiple replicas in Kubernetes
- **Enhancement**: Could add stress testing scenarios

## ☁️ Cloud Deployment

### AWS Free Tier Deployment

#### Prerequisites
- AWS Account
- AWS CLI configured
- Docker images pushed to ECR or Docker Hub

#### ECS Deployment (Recommended)
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name kube-credential-cluster

# Create task definitions and services
# (Use AWS Console or CloudFormation templates)
```

#### EKS Deployment
```bash
# Create EKS cluster
eksctl create cluster --name kube-credential --region us-west-2 --nodegroup-name standard-workers --node-type t3.medium --nodes 2

# Deploy application
kubectl apply -f k8s/
```

#### Alternative: Heroku Deployment
```bash
# Create Heroku apps
heroku create kube-credential-issuance
heroku create kube-credential-verification
heroku create kube-credential-frontend

# Configure environment variables
heroku config:set ISSUANCE_SERVICE_URL=https://kube-credential-issuance.herokuapp.com -a kube-credential-verification

# Deploy services
git subtree push --prefix backend/issuance-service heroku-issuance master
git subtree push --prefix backend/verification-service heroku-verification master
git subtree push --prefix frontend heroku-frontend master
```

## 📞 Contact Information

**Developer**: Venkat  
**Email**: [Your Email]  
**Phone**: [Your Phone Number]  

---

## 🎯 Assignment Compliance Checklist

- ✅ **Node.js (TypeScript) API**: Both services implemented
- ✅ **Docker Containerization**: All services containerized
- ✅ **Cloud Deployment Ready**: Docker images and K8s manifests
- ✅ **Two Microservices**: Issuance and Verification services
- ✅ **React (TypeScript) Frontend**: Two pages implemented
- ✅ **Independent Scalability**: Separate deployments
- ✅ **JSON Credential Handling**: Full JSON support
- ✅ **Duplicate Prevention**: Database constraints and logic
- ✅ **Worker ID Tracking**: Included in all responses
- ✅ **Persistence Layer**: SQLite database
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Unit Tests**: Jest tests for all services
- ✅ **Kubernetes Manifests**: Deployments, services, ingress
- ✅ **Documentation**: Complete README with architecture
- ✅ **Clean, Modular Code**: TypeScript with proper structure

---

## 📧 Contact

For questions or issues regarding this assignment, please contact:

- **Email**: <venkat.student@university.edu>
- **Student ID**: KUBE2024001
- **Assignment**: Microservices with Kubernetes
- **Submission Date**: December 2024

---

*This project demonstrates a production-ready microservice architecture with modern DevOps practices, suitable for cloud deployment and scaling.*