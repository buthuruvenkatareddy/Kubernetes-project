# Render Build Script for Issuance Service
#!/bin/bash

echo "🚀 Building Issuance Service for Render deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build TypeScript to JavaScript
echo "🔨 Building TypeScript..."
npm run build

# Verify build output
echo "✅ Verifying build..."
if [ -d "dist" ]; then
    echo "✅ Build successful - dist folder created"
    ls -la dist/
else
    echo "❌ Build failed - no dist folder found"
    exit 1
fi

echo "🎉 Issuance Service build completed successfully!"