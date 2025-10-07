# 🚀 Render.com Deployment Guide

## Free PostgreSQL Database + Web Services on Render

This guide will help you deploy your microservices project to Render.com **completely FREE!**

---

## ✨ **What You'll Get FREE:**
- ✅ **PostgreSQL Database** - Free forever
- ✅ **3 Web Services** - 750 hours/month each
- ✅ **Custom Domain** - Free `.onrender.com` subdomain
- ✅ **SSL Certificates** - Automatic HTTPS
- ✅ **GitHub Integration** - Auto-deploy on push

**💰 Total Cost: $0.00 forever!**

---

## 📋 **Step 1: Create Render Account (5 minutes)**

1. **Go to [render.com](https://render.com)**
2. **Click "Get Started"**
3. **Sign up with GitHub** (this connects your repository automatically)
4. **Authorize Render** to access your GitHub repositories

---

## 📋 **Step 2: Create PostgreSQL Database (5 minutes)**

1. **In Render Dashboard:**
   - Click **"New +"**
   - Select **"PostgreSQL"**

2. **Database Configuration:**
   - **Name:** `kube-credential-db`
   - **Database:** `credentials`
   - **User:** `credentials_user`
   - **Region:** `US East (Ohio)` (closest to free tier)
   - **PostgreSQL Version:** `15`
   - **Plan:** `Free` (0 GB - 1 GB)

3. **Click "Create Database"**

4. **Save Database URL:**
   - After creation, go to database **"Connect"** tab
   - Copy the **"External Database URL"**
   - It looks like: `postgresql://username:password@host:port/database`
   - **Save this URL - you'll need it!**

---

## 📋 **Step 3: Deploy Backend Services (10 minutes)**

### **3.1 Deploy Issuance Service**

1. **Create New Web Service:**
   - Click **"New +"** → **"Web Service"**
   - **Connect Repository:** Select your `Kubernetes-project` repository
   - **Name:** `kube-credential-issuance`
   - **Region:** `US East (Ohio)`
   - **Branch:** `main`
   - **Root Directory:** `backend/issuance-service`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

2. **Environment Variables:**
   Click **"Advanced"** → **"Add Environment Variable":**
   ```
   NODE_ENV = production
   PORT = 10000
   DATABASE_URL = [paste your PostgreSQL URL from Step 2]
   WORKER_ID = issuance-worker-1
   ```

3. **Click "Create Web Service"**

### **3.2 Deploy Verification Service**

1. **Create Another Web Service:**
   - **Name:** `kube-credential-verification`
   - **Root Directory:** `backend/verification-service`
   - **Same settings as above**

2. **Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 10000
   DATABASE_URL = [paste your PostgreSQL URL from Step 2]
   ISSUANCE_SERVICE_URL = https://kube-credential-issuance.onrender.com
   ```

3. **Click "Create Web Service"**

---

## 📋 **Step 4: Deploy Frontend (5 minutes)**

1. **Create Web Service for Frontend:**
   - **Name:** `kube-credential-frontend`
   - **Root Directory:** `frontend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve -s build -l $PORT`
   - **Plan:** `Free`

2. **Environment Variables:**
   ```
   NODE_ENV = production
   REACT_APP_ISSUANCE_API = https://kube-credential-issuance.onrender.com
   REACT_APP_VERIFICATION_API = https://kube-credential-verification.onrender.com
   ```

3. **Click "Create Web Service"**

---

## 📋 **Step 5: Access Your Application (2 minutes)**

After all services deploy successfully:

### **🌐 Your Live URLs:**
- **Frontend:** `https://kube-credential-frontend.onrender.com`
- **Issuance API:** `https://kube-credential-issuance.onrender.com`
- **Verification API:** `https://kube-credential-verification.onrender.com`

### **🧪 Test Your Application:**
1. **Open your frontend URL**
2. **Go to "Issue Credential" page**
3. **Fill out the form and submit**
4. **Go to "Verify Credential" page**
5. **Enter the credential ID to verify**

---

## 📋 **Step 6: Monitor Your Services (Ongoing)**

### **Render Dashboard Features:**
- ✅ **Real-time Logs** - See application output
- ✅ **Metrics** - CPU, Memory usage
- ✅ **Deploy History** - Track all deployments
- ✅ **Auto-Deploy** - Pushes to GitHub trigger deploys

### **Check Service Health:**
```bash
# Test APIs directly:
curl https://kube-credential-issuance.onrender.com/health
curl https://kube-credential-verification.onrender.com/health
```

---

## ⚠️ **Important Free Tier Limits:**

### **PostgreSQL Database:**
- **Storage:** 1 GB free
- **Connections:** 97 concurrent connections
- **Expires:** Never (free forever!)

### **Web Services:**
- **Compute:** 750 hours/month per service
- **Sleep:** Services sleep after 15 minutes of inactivity
- **Wake up:** 30-60 seconds to wake from sleep
- **Bandwidth:** 100 GB/month

### **📊 Free Tier Usage:**
- **3 services × 750 hours = 2,250 hours/month**
- **= 75 hours/day total**
- **= Perfect for portfolio/demo projects!**

---

## 🚀 **Deployment Status Checklist:**

### ✅ **Database Setup:**
- [ ] PostgreSQL database created
- [ ] Database URL copied
- [ ] Database accessible

### ✅ **Backend Services:**
- [ ] Issuance service deployed and running
- [ ] Verification service deployed and running
- [ ] Both services connected to database
- [ ] Health endpoints working

### ✅ **Frontend:**
- [ ] React app deployed and running
- [ ] Connected to backend APIs
- [ ] Forms working correctly

### ✅ **Testing:**
- [ ] Can issue credentials
- [ ] Can verify credentials
- [ ] All API endpoints responding

---

## 🔧 **Troubleshooting:**

### **Service Won't Start:**
- Check logs in Render dashboard
- Verify environment variables
- Check build commands

### **Database Connection Issues:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Test connection from service logs

### **Frontend Can't Connect to Backend:**
- Verify API URLs in environment variables
- Check CORS settings in backend
- Test API endpoints directly

---

## 🎉 **Success! Your App is Live!**

### **🌟 What You've Achieved:**
- ✅ **Professional deployment** on cloud infrastructure
- ✅ **PostgreSQL database** with persistent storage
- ✅ **Microservices architecture** with separate services
- ✅ **Auto-deployment** from GitHub
- ✅ **HTTPS/SSL** certificates automatically
- ✅ **Monitoring and logs** built-in

### **📝 Portfolio Ready:**
- Add these URLs to your resume
- Document the architecture
- Showcase the deployment process
- Demonstrate scalable design

### **💡 Next Steps:**
- **Custom Domain** - Add your own domain name
- **Environment Management** - Set up staging environment
- **Monitoring** - Set up alerts and notifications
- **Performance** - Monitor and optimize response times

**🎯 Your project is now live and accessible worldwide!**