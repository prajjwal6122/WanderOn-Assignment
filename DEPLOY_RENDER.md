# Deployment Guide: Render 🚀

Complete guide to deploy the WanderOn Authentication System on Render.

## 🌐 Render Overview

Render is a modern cloud platform that makes deploying applications simple and free. It supports:
- Node.js applications
- MongoDB databases
- Static frontends
- Auto-scaling

**Website**: [https://render.com](https://render.com)

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Account**
   - Create at [github.com](https://github.com)
   - Push your code there

2. **Render Account**
   - Sign up at [render.com](https://render.com)
   - Free tier available

3. **Project Ready**
   - All tests passing locally
   - Environment variables documented
   - Code committed to GitHub

---

## 🔄 Step 1: Prepare Code for Deployment

### 1.1 Update Environment Variables

In `server/.env.example`:
```env
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database (will use MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderon?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Client (will update after deployment)
CLIENT_URL=https://your-frontend-url.onrender.com

# Security
BCRYPT_ROUNDS=10
```

### 1.2 Ensure Production Build Scripts

In `server/package.json`:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'No build needed for Node.js'"
  }
}
```

In `client/package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 1.3 Check .gitignore

Make sure `.gitignore` includes:
```
node_modules/
.env
.env.local
.DS_Store
dist/
build/
.next/
```

### 1.4 Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: WanderOn authentication system"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/yourusername/WanderOn-Assignment.git
git push -u origin main
```

---

## 🗄️ Step 2: Set Up MongoDB Atlas

### 2.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up and create account
3. Verify email

### 2.2 Create Cluster

1. Click "Create Deployment"
2. Select "M0 Sandbox" (free tier)
3. Choose your region
4. Click "Create Deployment"
5. Wait 2-3 minutes for creation

### 2.3 Set Up Authentication

1. In cluster, click "Database Access"
2. Click "Add New Database User"
3. Create username and password (SAVE THESE!)
4. Click "Add User"

### 2.4 Configure Network Access

1. Click "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. Click "Confirm"

**⚠️ For production, restrict to specific IPs**

### 2.5 Get Connection String

1. Click "Databases"
2. Click "Connect" on your cluster
3. Select "Connect to your application"
4. Choose "Node.js" and version
5. Copy the connection string

**Example**:
```
mongodb+srv://username:password@cluster.mongodb.net/wanderon?retryWrites=true&w=majority
```

Replace:
- `username` - your database username
- `password` - your database password
- Keep `wanderon` as database name

---

## 🖥️ Step 3: Deploy Backend on Render

### 3.1 Create Render Account

1. Go to [Render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub
4. Authorize Render to access your GitHub

### 3.2 Create Web Service (Backend)

1. Go to Dashboard
2. Click "New +"
3. Select "Web Service"
4. Connect to your GitHub repository
5. Select the repository containing your code

### 3.3 Configure Backend Service

**Service Settings**:
- Name: `wanderon-api` (or any name)
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Region: Choose closest to you

**Do NOT deploy yet** - need to set environment variables first

### 3.4 Add Environment Variables

In Render dashboard:

1. Scroll to "Environment Variables"
2. Click "Add Environment Variable"
3. Add each variable:

```
NODE_ENV              production
MONGODB_URI           mongodb+srv://username:password@cluster...
JWT_SECRET            your_super_secret_key_12345
JWT_EXPIRE            7d
JWT_COOKIE_EXPIRE     7
CLIENT_URL            https://yourdomain.onrender.com (frontend URL)
PORT                  5000
BCRYPT_ROUNDS         10
```

**⚠️ Important**:
- Don't commit .env file to GitHub
- Set variables in Render dashboard only
- Use strong, random JWT_SECRET

### 3.5 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment (2-5 minutes)
3. You'll get URL: `https://wanderon-api.onrender.com`

**Check Deployment**:
```bash
# Test your API
curl https://wanderon-api.onrender.com/api/auth/me

# Should return 401 (not logged in) - that's correct!
```

---

## 🎨 Step 4: Deploy Frontend on Render

### 4.1 Create Static Site

1. Go to Render Dashboard
2. Click "New +"
3. Select "Static Site"

### 4.2 Configure Frontend

**Site Settings**:
- Name: `wanderon-app` (or any name)
- Branch: `main`
- Build Command: `cd client && npm install && npm run build`
- Publish Directory: `client/dist`

### 4.3 Update Client Configuration

Before deploying, update `client/src/context/AuthContext.jsx`:

```javascript
// Change from localhost
axios.defaults.baseURL = 'https://wanderon-api.onrender.com';
// Note: Use your actual Render backend URL
```

Or better, use environment variable:

In `client/.env`:
```
VITE_API_BASE_URL=https://wanderon-api.onrender.com
```

In `AuthContext.jsx`:
```javascript
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

### 4.4 Deploy Frontend

1. Click "Create Static Site"
2. Wait for build and deployment (2-5 minutes)
3. You'll get URL: `https://wanderon-app.onrender.com`

---

## 🔗 Step 5: Connect Frontend & Backend

### 5.1 Update Backend CLIENT_URL

1. Go to Render Dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `CLIENT_URL`:
   ```
   https://wanderon-app.onrender.com
   ```
5. Click "Save Changes"
6. Service will redeploy automatically

### 5.2 Verify Connection

1. Open frontend: `https://wanderon-app.onrender.com`
2. Try to register
3. Check browser console (F12) for any CORS errors
4. Check Render logs for backend errors

---

## ✅ Verification Checklist

- [ ] Backend service deployed successfully
- [ ] Frontend static site deployed successfully
- [ ] MongoDB Atlas cluster running
- [ ] Environment variables set in Render
- [ ] Frontend can reach backend (no CORS errors)
- [ ] Can register new user
- [ ] Can login
- [ ] Can access dashboard
- [ ] Can logout
- [ ] Cookie properly set and cleared

---

## 🐛 Troubleshooting

### Frontend Shows "Cannot reach backend"

**Solution**:
1. Check backend URL in `AuthContext.jsx`
2. Ensure `CLIENT_URL` in backend env matches frontend URL
3. Restart both services in Render

### CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check backend `app.js` CORS configuration
2. Ensure `CLIENT_URL` environment variable is set
3. Restart backend service

```javascript
// In server/app.js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

### "MongoDB connection failed"

**Solution**:
1. Verify MongoDB Atlas cluster is running
2. Check `MONGODB_URI` in Render environment
3. Ensure IP is whitelisted in MongoDB Atlas
4. Test connection string locally

### "Cannot read property 'password'"

**Solution**:
1. Ensure user exists in database
2. Check MongoDB is populated with test data
3. Login page should create new user on registration

### Deployed App Works Locally But Not on Render

**Solution**:
1. Check Render logs: Click service → "Logs"
2. Look for errors in deployment
3. Verify all environment variables are set
4. Check file permissions and scripts

---

## 📊 Monitoring & Logs

### View Backend Logs

1. Go to Render Dashboard
2. Select your backend service
3. Click "Logs" tab
4. Scroll through logs for errors

**Look for**:
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

### View Frontend Logs

1. Open frontend URL
2. Open DevTools (F12)
3. Go to "Console" tab
4. Look for errors in red

**Common issues**:
```
GET http://localhost:5000/... 404
// Frontend trying to reach localhost instead of Render backend
```

---

## 🔒 Security Best Practices

1. **Never commit .env file**
   ```
   # In .gitignore
   .env
   .env.local
   ```

2. **Use strong JWT_SECRET**
   ```bash
   # Generate random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Rotate secrets regularly**
   - Change JWT_SECRET every few months
   - Update in Render environment

4. **Restrict MongoDB IP access**
   - Go to MongoDB Atlas
   - Network Access
   - Whitelist only your Render servers

5. **Use HTTPS everywhere**
   - Render provides free HTTPS
   - Use `secure: true` in cookies for production

---

## 💰 Pricing & Limits

### Render Free Tier Includes:

- ✅ 1 Web Service (Backend)
- ✅ 1 Static Site (Frontend)
- ✅ Auto-scaling
- ✅ HTTPS
- ✅ 750 hours/month
- ❌ No database hosting (use MongoDB Atlas - also free)

### MongoDB Atlas Free Tier:

- ✅ 512 MB storage
- ✅ Unlimited shared clusters
- ✅ Unlimited read/write operations
- ✅ Perfect for development

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push

Render automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit: `git commit -m "Update"`
3. Push: `git push`
4. Render automatically builds and deploys (2-5 minutes)

### Check Deployment Status

1. Go to Render Dashboard
2. Select service
3. Look at "Latest Deployment"
4. Should show "Live" and recent timestamp

---

## 📱 Mobile & Cross-Device Testing

After deployment, test on:

- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iPhone, Android)
- [ ] Tablet
- [ ] Different networks (WiFi, 4G)

---

## 🎓 Next Steps

After deployment:

1. **Share URL**
   - Frontend: `https://wanderon-app.onrender.com`
   - Show to evaluators

2. **Create Test Accounts**
   - Register: testuser / testuser@example.com
   - Password: TestPass123!@#

3. **Document**
   - Add deployment URL to README.md
   - Update with live link

4. **Monitor**
   - Check logs regularly
   - Monitor performance
   - Be ready to fix issues

---

## 📞 Support & Resources

### Render Docs
- [Render Docs](https://render.com/docs)
- [Deploying Node.js](https://render.com/docs/deploy-node-express)
- [Static Site Deploy](https://render.com/docs/static-sites)

### MongoDB Docs
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)

### Common Commands

```bash
# View live logs
render logs wanderon-api

# Redeploy
git push  # Automatic

# Check status
render services
```

---

## ✨ Success Indicators

You'll know deployment is successful when:

1. ✅ Frontend loads without errors
2. ✅ Can register new user
3. ✅ Can login
4. ✅ Dashboard displays user info
5. ✅ Can change password
6. ✅ Can logout
7. ✅ Session persists on refresh
8. ✅ All features work smoothly

---

**Last Updated**: January 2026
**Render Deployment Version**: 1.0.0

**Ready to deploy?** Follow the steps above carefully, and you'll have your app live in minutes!
