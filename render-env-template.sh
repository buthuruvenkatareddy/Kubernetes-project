# Environment Variables Template for Render Deployment

# Copy these exact values when setting up your services on Render.com

echo "=============================================="
echo "🚀 RENDER DEPLOYMENT - ENVIRONMENT VARIABLES"
echo "=============================================="
echo ""

echo "📋 1. ISSUANCE SERVICE Environment Variables:"
echo "   Copy these in Render dashboard for 'kube-credential-issuance':"
echo ""
echo "   NODE_ENV = production"
echo "   PORT = 10000"
echo "   DATABASE_URL = [PASTE_YOUR_POSTGRESQL_URL_HERE]"
echo "   WORKER_ID = issuance-worker-1"
echo ""

echo "📋 2. VERIFICATION SERVICE Environment Variables:"
echo "   Copy these in Render dashboard for 'kube-credential-verification':"
echo ""
echo "   NODE_ENV = production"
echo "   PORT = 10000"
echo "   DATABASE_URL = [PASTE_YOUR_POSTGRESQL_URL_HERE]"
echo "   ISSUANCE_SERVICE_URL = https://kube-credential-issuance.onrender.com"
echo ""

echo "📋 3. FRONTEND Environment Variables:"
echo "   Copy these in Render dashboard for 'kube-credential-frontend':"
echo ""
echo "   NODE_ENV = production"
echo "   REACT_APP_ISSUANCE_API = https://kube-credential-issuance.onrender.com"
echo "   REACT_APP_VERIFICATION_API = https://kube-credential-verification.onrender.com"
echo ""

echo "🔗 Your PostgreSQL Database URL will look like:"
echo "   postgresql://username:password@host:port/database"
echo ""

echo "📝 DEPLOYMENT CHECKLIST:"
echo "   ✅ 1. Create PostgreSQL database on Render"
echo "   ✅ 2. Copy database URL"
echo "   ✅ 3. Deploy issuance service with above env vars"
echo "   ✅ 4. Deploy verification service with above env vars"
echo "   ✅ 5. Deploy frontend with above env vars"
echo "   ✅ 6. Test all services are working"
echo ""

echo "🌐 After deployment, your live URLs will be:"
echo "   Frontend: https://kube-credential-frontend.onrender.com"
echo "   Issuance API: https://kube-credential-issuance.onrender.com"
echo "   Verification API: https://kube-credential-verification.onrender.com"
echo ""

echo "=============================================="
echo "Ready to deploy! Follow the RENDER_DEPLOYMENT_GUIDE.md"
echo "=============================================="