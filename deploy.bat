@echo off
REM Kube Credential System - Build and Deploy Script for Windows
REM This script builds all Docker images and optionally deploys to Kubernetes

echo 🚀 Kube Credential System - Build & Deploy Script
echo ==================================================

echo 🔨 Building Docker images...

echo 📦 Building issuance-service...
cd backend\issuance-service
docker build -t kube-credential/issuance-service:latest .
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to build issuance-service
    exit /b 1
)
echo ✅ issuance-service built successfully
cd ..\..

echo 📦 Building verification-service...
cd backend\verification-service
docker build -t kube-credential/verification-service:latest .
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to build verification-service
    exit /b 1
)
echo ✅ verification-service built successfully
cd ..\..

echo 📦 Building frontend...
cd frontend
docker build -t kube-credential/frontend:latest .
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to build frontend
    exit /b 1
)
echo ✅ frontend built successfully
cd ..

echo.
echo 🎉 All images built successfully!
echo.

set /p deploy_k8s="🤔 Do you want to deploy to Kubernetes? (y/N): "

if /i "%deploy_k8s%"=="y" (
    echo ☸️  Deploying to Kubernetes...
    
    kubectl apply -f k8s\issuance-deployment.yaml
    kubectl apply -f k8s\verification-deployment.yaml
    kubectl apply -f k8s\ingress.yaml
    
    echo ⏳ Waiting for deployments to be ready...
    kubectl wait --for=condition=available --timeout=300s deployment/issuance-service
    kubectl wait --for=condition=available --timeout=300s deployment/verification-service
    
    echo ✅ Kubernetes deployment completed!
    echo.
    echo 📊 Deployment Status:
    kubectl get pods -l app=issuance-service
    kubectl get pods -l app=verification-service
    kubectl get services
    
    echo.
    echo 🌐 Access URLs:
    echo - Issuance Service: http://localhost:3001 (after port-forward)
    echo - Verification Service: http://localhost:3002 (after port-forward)
    echo.
    echo 🔧 Port forward commands:
    echo kubectl port-forward service/issuance-service 3001:3001
    echo kubectl port-forward service/verification-service 3002:3002
) else (
    echo ⚡ Using Docker Compose for local development...
    docker-compose up -d
    
    echo ✅ Services started with Docker Compose!
    echo.
    echo 🌐 Access URLs:
    echo - Frontend: http://localhost:3000
    echo - Issuance API: http://localhost:3001
    echo - Verification API: http://localhost:3002
    echo.
    echo 📋 Useful commands:
    echo - View logs: docker-compose logs -f
    echo - Stop services: docker-compose down
)

echo.
echo 🎊 Setup complete! Happy coding!
pause