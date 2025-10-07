# Render Build Script for Verification Service
#!/bin/bash

echo "🚀 Building Verification Service for Render deployment..."

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

echo "🎉 Verification Service build completed successfully!"