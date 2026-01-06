# Local Setup & Development Guide 🚀

Complete guide to set up and run the WanderOn Authentication System locally.

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v14.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org)
  - Verify: `node --version` & `npm --version`

- **MongoDB** (Local or Atlas Account)
  - **Option A**: Local MongoDB installation
    - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
  - **Option B**: MongoDB Atlas (Cloud)
    - Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

- **Git** (for version control)
  - Download from [git-scm.com](https://git-scm.com)

- **Code Editor** (VS Code recommended)
  - Download from [code.visualstudio.com](https://code.visualstudio.com)

---

## 🛠️ Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd "WanderOn Assignment"

# List contents
ls -la
# You should see: client/, server/, README.md, API_DOCUMENTATION.md, etc.
```

### Step 2: MongoDB Setup

#### Option A: Using MongoDB Atlas (Cloud) - Recommended for Beginners

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Try Free" and create account
   - Verify email

2. **Create Cluster**
   - Select free tier
   - Choose region closest to you
   - Click "Create Cluster"
   - Wait for cluster to be ready (2-3 minutes)

3. **Get Connection String**
   - Click "Connect"
   - Select "Connect to your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/wanderon?retryWrites=true&w=majority`

4. **Save Connection String**
   - You'll use this in `.env` file

#### Option B: Using Local MongoDB

1. **Install MongoDB**
   ```bash
   # Windows
   # Download and run installer from https://www.mongodb.com/try/download/community
   
   # Mac
   brew install mongodb-community
   
   # Linux (Ubuntu)
   sudo apt-get install -y mongodb
   ```

2. **Start MongoDB Service**
   ```bash
   # Windows (run as Administrator)
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify Connection**
   ```bash
   mongosh  # Opens MongoDB shell
   # You should see: test>
   # Type: exit  (to exit)
   ```

4. **Connection String**
   ```
   mongodb://localhost:27017/wanderon
   ```

---

### Step 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# This installs:
# - express: Web framework
# - mongodb: Database driver
# - jsonwebtoken: JWT token generation
# - bcryptjs: Password hashing
# - express-validator: Input validation
# - cors: Cross-origin requests
# - dotenv: Environment variables
# - helmet: Security headers
# - and more...

# Verify installation
npm list  # Lists all installed packages
```

### Step 4: Environment Configuration

```bash
# In server directory
# Create .env file (if .env.example doesn't exist)

cat > .env << EOF
# Environment
NODE_ENV=development

# Server
PORT=5000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/wanderon
# OR if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderon?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Client
CLIENT_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=10
EOF
```

**Environment Variables Explained**:

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/wanderon` |
| `JWT_SECRET` | Token signing key | `your-secret-key` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |

### Step 5: Test Backend

```bash
# Still in server directory

# Start development server
npm run dev

# Expected output:
# ✅ MongoDB connected successfully
# ✅ Server running on http://localhost:5000
# ✅ Environment: development
```

**Keep this terminal open!** Open a new terminal for the next steps.

---

### Step 6: Frontend Setup

```bash
# Open NEW terminal

# Navigate to project root, then to client
cd "WanderOn Assignment"
cd client

# Install dependencies
npm install

# Verify installation
npm list
```

### Step 7: Frontend Configuration

```bash
# Check .env file (or create if needed)

# Frontend should automatically target:
# Backend: http://localhost:5000
# (See client/src/context/AuthContext.jsx - axios.defaults.baseURL)
```

### Step 8: Test Frontend

```bash
# In client directory

# Start development server
npm run dev

# Expected output:
# ✅ VITE v... ready in ... ms
# ✅ ➜ Local: http://localhost:5173/
```

**Expected localhost URLs**:
- Frontend: `http://localhost:5173` (or `http://localhost:3000`)
- Backend: `http://localhost:5000`

---

## ✅ Verification Checklist

### Backend Running?

```bash
# Test in new terminal
curl http://localhost:5000/api/auth/me

# Expected response (401 - not logged in):
# {"success":false,"message":"Not authorized..."}
```

### Database Connected?

```bash
# Check server logs for:
# ✅ MongoDB connected successfully
# ✅ Users collection ready
```

### Frontend Accessible?

- Open browser: `http://localhost:5173`
- Should see login page
- Check console (F12) for any errors

---

## 🧪 First Test: Register a User

1. **Open Frontend**
   - Go to: http://localhost:5173

2. **Click "Register"** (or navigate to register page)

3. **Fill Form**
   ```
   Username: testuser
   Email: test@example.com
   First Name: Test
   Last Name: User
   Password: TestPass123!@#
   Confirm: TestPass123!@#
   ```

4. **Submit**
   - Should redirect to dashboard
   - Check backend logs for: `✅ User registered: test@example.com`

5. **Test Features**
   - Click Profile → Edit Profile
   - Click Settings → Change Password
   - Click Logout

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:
```bash
# Option 1: Start MongoDB locally
mongod  # On Mac/Linux

# Option 2: Use MongoDB Atlas
# Update MONGODB_URI in .env with your Atlas connection string
```

### Issue: "Port 5000 already in use"

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
# Option 1: Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Option 2: Change port in .env
# NODE_ENV=development
# PORT=5001  # Changed from 5000
```

### Issue: "Frontend can't reach backend"

```
CORS error or Network error
```

**Solution**:
```bash
# 1. Check backend is running
curl http://localhost:5000

# 2. Check CLIENT_URL in .env
# Should match frontend URL: http://localhost:5173

# 3. Restart both servers
# Kill and restart npm run dev
```

### Issue: "Dependencies not installed"

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Module not found errors"

```bash
# Make sure you're in correct directory
pwd  # Check current directory
cd server  # or cd client

# Reinstall
npm install

# Check package.json exists
ls package.json
```

---

## 📁 Project Structure After Setup

```
WanderOn Assignment/
├── client/
│   ├── node_modules/          ← Installed after npm install
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── node_modules/          ← Installed after npm install
│   ├── src/
│   ├── package.json
│   └── .env                   ← Created during setup
├── README.md
├── API_DOCUMENTATION.md
├── ARCHITECTURE.md
├── VALIDATION_SYSTEM.md
└── SETUP.md (this file)
```

---

## 🔄 Daily Development Workflow

### Starting Development

```bash
# Terminal 1: Start Backend
cd server
npm run dev
# Wait for: ✅ Server running on http://localhost:5000

# Terminal 2: Start Frontend
cd client
npm run dev
# Wait for: ✅ Local: http://localhost:5173/

# Terminal 3: (Optional) MongoDB logs
mongod --logpath ./mongodb.log
```

### Stopping Development

```bash
# Press Ctrl+C in each terminal to stop the servers
```

### Making Changes

#### Backend Changes
```bash
# Files in server/src/ auto-reload
# Just modify and server will restart
# Check terminal for: ✅ Server restarted
```

#### Frontend Changes
```bash
# Files in client/src/ auto-reload
# Just modify and browser will refresh
# Hot Module Replacement (HMR) enabled
```

---

## 📚 Useful Development Commands

### Backend Commands

```bash
cd server

# Start development server (with auto-reload)
npm run dev

# Check for lint errors (if configured)
npm run lint

# Run tests (if configured)
npm test
```

### Frontend Commands

```bash
cd client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check for lint errors
npm run lint
```

---

## 🔗 Useful Resources

### Documentation Files (in project)
- `README.md` - Project overview
- `API_DOCUMENTATION.md` - All API endpoints
- `ARCHITECTURE.md` - System design
- `VALIDATION_SYSTEM.md` - Validation rules
- `TESTING.md` - Test cases (coming next)

### External Resources
- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [JWT Docs](https://jwt.io)

### Tools & Services
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Postman](https://www.postman.com) - API Testing
- [VS Code](https://code.visualstudio.com) - Code Editor
- [Git](https://git-scm.com) - Version Control

---

## 🆘 Getting Help

### Check Logs

1. **Backend Logs**
   - Look at terminal running `npm run dev`
   - Errors show immediately

2. **Frontend Logs**
   - Open browser DevTools (F12)
   - Check Console and Network tabs

3. **Database Logs**
   ```bash
   mongosh
   > show databases
   > use wanderon
   > db.users.find()
   ```

### Debug Mode

```bash
# Backend with debug logging
DEBUG=express:* npm run dev

# Frontend DevTools
# Press F12 in browser, go to Sources tab
```

---

## ✨ Next Steps

After successful setup:

1. **Read Documentation**
   - Start with API_DOCUMENTATION.md
   - Understand ARCHITECTURE.md

2. **Test the API**
   - Use provided curl examples
   - Or use Postman

3. **Make Modifications**
   - Try changing UI
   - Add new fields
   - Extend functionality

4. **Deploy** (when ready)
   - See DEPLOY.md for Render instructions

---

## 🎓 Learning Path

1. **Understand Structure** → Read ARCHITECTURE.md
2. **Explore APIs** → Read API_DOCUMENTATION.md
3. **Test APIs** → Use curl or Postman
4. **Read Code** → Understand controllers, routes, models
5. **Make Changes** → Add features or fix bugs
6. **Deploy** → Push to production

---

**Last Updated**: January 2026
**Setup Version**: 1.0.0

---

**Stuck?** Check the troubleshooting section above or review the logs carefully. Most issues have clear error messages that point to the solution!
