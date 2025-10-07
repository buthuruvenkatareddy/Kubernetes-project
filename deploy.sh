#!/bin/bash

# Kube Credential System - Build and Deploy Script
# This script builds all Docker images and optionally deploys to Kubernetes

set -e

echo "🚀 Kube Credential System - Build & Deploy Script"
echo "=================================================="

# Function to build service
build_service() {
    local service_path=$1
    local service_name=$2
    
    echo "📦 Building $service_name..."
    cd "$service_path"
    docker build -t "kube-credential/$service_name:latest" .
    echo "✅ $service_name built successfully"
    cd - > /dev/null
}

# Build all services
echo "🔨 Building Docker images..."
build_service "backend/issuance-service" "issuance-service"
build_service "backend/verification-service" "verification-service"
build_service "frontend" "frontend"

echo ""
echo "🎉 All images built successfully!"
echo ""

# Ask for deployment
read -p "🤔 Do you want to deploy to Kubernetes? (y/N): " deploy_k8s

if [[ $deploy_k8s =~ ^[Yy]$ ]]; then
    echo "☸️  Deploying to Kubernetes..."
    
    # Apply Kubernetes manifests
    kubectl apply -f k8s/issuance-deployment.yaml
    kubectl apply -f k8s/verification-deployment.yaml
    kubectl apply -f k8s/ingress.yaml
    
    echo "⏳ Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/issuance-service
    kubectl wait --for=condition=available --timeout=300s deployment/verification-service
    
    echo "✅ Kubernetes deployment completed!"
    echo ""
    echo "📊 Deployment Status:"
    kubectl get pods -l app=issuance-service
    kubectl get pods -l app=verification-service
    kubectl get services
    
    echo ""
    echo "🌐 Access URLs:"
    echo "- Issuance Service: http://localhost:3001 (after port-forward)"
    echo "- Verification Service: http://localhost:3002 (after port-forward)"
    echo ""
    echo "🔧 Port forward commands:"
    echo "kubectl port-forward service/issuance-service 3001:3001"
    echo "kubectl port-forward service/verification-service 3002:3002"
else
    echo "⚡ Using Docker Compose for local development..."
    docker-compose up -d
    
    echo "✅ Services started with Docker Compose!"
    echo ""
    echo "🌐 Access URLs:"
    echo "- Frontend: http://localhost:3000"
    echo "- Issuance API: http://localhost:3001"
    echo "- Verification API: http://localhost:3002"
    echo ""
    echo "📋 Useful commands:"
    echo "- View logs: docker-compose logs -f"
    echo "- Stop services: docker-compose down"
fi

echo ""
echo "🎊 Setup complete! Happy coding!"