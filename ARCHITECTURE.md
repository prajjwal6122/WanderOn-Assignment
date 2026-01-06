# System Architecture 🏗️

Comprehensive overview of the WanderOn Authentication System architecture, design patterns, and technical decisions.

## 🎯 Design Philosophy

This system is built following **SOLID principles** and **DRY (Don't Repeat Yourself)** to ensure:
- **Maintainability**: Easy to understand and modify
- **Scalability**: Can handle growth without major refactoring
- **Security**: Industry-standard security practices
- **Testability**: Components can be tested independently
- **Reusability**: Components designed for maximum code reuse

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React Frontend)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages (Login, Register, Dashboard)                 │  │
│  │  Components (Modal, Forms)                          │  │
│  │  AuthContext (Global State Management)              │  │
│  └──────────────────────────────────────────────────────┘  │
└────────┬──────────────────────────────────────────────────┬─┘
         │  HTTPS / CORS                                   │
         │  JSON Requests / Responses                      │
         ▼                                                   ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVER (Express.js Backend)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes & Controllers                           │  │
│  │  - Auth Controller (Register, Login, Logout)        │  │
│  │  - User Controller (Profile, Password)              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Middleware Layer                                   │  │
│  │  - Authentication (JWT Verification)               │  │
│  │  - Validation (Input Sanitization)                 │  │
│  │  - Error Handling                                   │  │
│  │  - Security Headers (Helmet, CORS, Rate Limit)     │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Business Logic                                     │  │
│  │  - Password Hashing (bcryptjs)                      │  │
│  │  - Token Generation (JWT)                           │  │
│  │  - Data Validation                                  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Data Access Layer                                  │  │
│  │  - User Model (Mongoose)                           │  │
│  │  - Schema Definition & Methods                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────┬──────────────────────────────────────────────────┬─┘
         │  MongoDB Connection                             │
         │  Queries & Updates                              │
         ▼                                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Users Collection                                   │  │
│  │  - User Documents                                   │  │
│  │  - Indexes (email, username)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request-Response Flow

### Registration Flow

```
1. User Input (Frontend)
   └─> Validation
       └─> Server
           └─> Validation Middleware (express-validator)
               └─> Sanitization (XSS, NoSQL injection)
                   └─> Hash Password (bcryptjs)
                       └─> Save to Database
                           └─> Generate JWT Token
                               └─> Send Response with Token
                                   └─> Store in Cookie
                                       └─> Redirect to Dashboard
```

**Code Path**:
```
UI Input → handleSubmit()
  → AuthContext.register()
    → axios.post('/api/auth/register')
      → routes/authRoute.js
        → registerValidation middleware
          → authController.register()
            → User.create()
              → MongoDB
                ← Hashed password stored
              ← sendTokenResponse()
                → Cookie set
                  ← Response to client
```

### Login Flow

```
1. User Credentials
   └─> Server Validation
       └─> Find User by email/username
           └─> Compare Password (bcryptjs)
               └─> Update lastLogin
                   └─> Generate JWT
                       └─> Set Cookie
                           └─> Send Response
```

**Code Path**:
```
UI Form → handleSubmit()
  → AuthContext.login()
    → axios.post('/api/auth/login', {identifier, password})
      → routes/authRoute.js
        → loginValidation middleware
          → authController.login()
            → User.findOne({email or username})
              → comparePassword()
                ← isPasswordValid
              → updateLastLogin()
              → sendTokenResponse()
                ← JWT Token + Cookie
```

### Protected Route Access

```
1. Request to Protected Endpoint
   └─> protect middleware
       └─> Extract Token from Cookie/Header
           └─> Verify JWT Signature
               └─> Decode Token
                   └─> Find User by ID
                       └─> Check if Active
                           └─> Attach User to Request
                               └─> Next Middleware/Controller
```

---

## 🛡️ Security Architecture

### 1. Password Security

```
User Password
   ↓
bcryptjs with 10 salt rounds
   ↓
Hashed Password (irreversible)
   ↓
Stored in Database
   ↓
User Never Returned in API Responses
```

**Implementation**:
```javascript
// usersSchema.js
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Comparison
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### 2. Token Security

```
User ID
   ↓
JWT Sign with Secret
   ↓
JWT Token (7 day expiration)
   ↓
Stored in httpOnly Cookie (XSS protection)
   ↓
Sent with every Protected Request
   ↓
Verified before Access
```

**Cookie Configuration**:
```javascript
{
  httpOnly: true,          // Not accessible via JavaScript
  secure: true,            // HTTPS only (production)
  sameSite: 'strict',      // CSRF protection
  path: '/',               // Available for all paths
  maxAge: 7 * 24 * 60...   // 7 days
}
```

### 3. Input Validation & Sanitization

```
User Input
   ↓
Trim Whitespace
   ↓
Validate Format (email, length, etc.)
   ↓
Custom Validation (unique check)
   ↓
Escape Special Characters (XSS prevention)
   ↓
MongoDB Sanitization (NoSQL injection prevention)
   ↓
Processed Data
```

**Multi-layer Validation**:
```
Frontend Validation (UX feedback)
   ↓
Express-validator (server-side rules)
   ↓
Mongo-sanitize (injection prevention)
   ↓
Mongoose Schema Validation
```

### 4. Additional Security Measures

- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for specific origins
- **Helmet.js**: Secure HTTP headers
- **HPP**: Parameter pollution prevention
- **XSS Protection**: Input sanitization + CSP headers

---

## 📦 Component Architecture

### Frontend Components

#### AuthContext (State Management)
```javascript
AuthContext
├── user (current user object)
├── loading (loading state)
├── error (error messages)
└── Functions:
    ├── login(identifier, password)
    ├── register(userData)
    ├── logout()
    ├── updateProfile(data)
    └── checkAuth() [on mount]
```

**Purpose**: Centralized auth state accessible from any component

#### Pages
```
Login.jsx
├── Form Input
├── Validation
└── Authentication

Register.jsx
├── Multi-field Form
├── Password Matching
└── Registration

Dashboard.jsx
├── User Info Display
├── Profile Management
└── Settings
```

#### Modals
```
EditProfileModal
├── Username/Email Update
└── Profile Picture Upload

ChangePasswordModal
├── Current Password
├── New Password
└── Confirmation
```

### Backend Structure

#### Routes (Route Layer)
```javascript
// authRoute.js
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePasswordValidation, updatePassword);
router.put('/updateprofile', protect, updateProfileValidation, updateProfile);
router.get('/logout', protect, logout);
```

**Responsibility**: Define endpoints and apply middleware

#### Controllers (Business Logic Layer)
```javascript
// authController.js
export const register = async (req, res) => {
  // 1. Validate input (via middleware)
  // 2. Check if user exists
  // 3. Hash password
  // 4. Create user
  // 5. Generate token
  // 6. Send response
}
```

**Responsibility**: Implement business logic, handle requests

#### Middleware (Cross-cutting Concerns)
```javascript
// authMiddleware.js - Authentication
export const protect = async (req, res, next) => {
  // 1. Extract token
  // 2. Verify token
  // 3. Get user
  // 4. Attach to request
  // 5. Call next()
}

// validations.js - Input Validation
export const registerValidation = [
  body('username').trim().notEmpty()...
  body('email').isEmail()...
  body('password').matches(regex)...
]

// errorHandler.js - Error Handling
export const errorHandler = (err, req, res, next) => {
  // Format and send error responses
}
```

**Responsibility**: Cross-cutting concerns, not business logic

#### Models (Data Layer)
```javascript
// usersSchema.js
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  // ... other fields
});

// Methods
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}
```

**Responsibility**: Data structure, validation, methods

---

## 🔌 Data Flow

### Typical Request Flow

```
1. HTTP Request Arrives
   ↓
2. Body Parser (parse JSON)
   ↓
3. CORS Middleware (check origin)
   ↓
4. Rate Limiter (check limit)
   ↓
5. Security Middleware (helmet, sanitize)
   ↓
6. Route Matching
   ↓
7. Specific Validation Middleware (if required)
   ↓
8. Authentication Middleware (if protected route)
   ↓
9. Controller Function
   ↓
10. Database Query (if needed)
    ↓
11. Response Sent
    ↓
12. Cookie Set (if applicable)
```

---

## 🗄️ Database Design

### User Collection

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  first_name: String,          // Indexed for search
  last_name: String,
  username: String,            // Unique index
  email: String,               // Unique index
  
  // Security
  password: String,            // Hashed, not returned
  
  // Status
  role: String,                // 'user' or 'admin'
  isActive: Boolean,           // Account status
  
  // Login Info
  lastLogin: Date,
  loginAttempts: Number,       // For lockout logic
  lockUntil: Date,             // Lockout expiry
  
  // Timestamps
  createdAt: Date,             // Auto
  updatedAt: Date              // Auto
}
```

**Indexes** (for performance):
```javascript
{ email: 1 }           // Quick lookup by email
{ username: 1 }        // Quick lookup by username
{ createdAt: -1 }      // Sort by recent
```

---

## 🎯 Design Patterns Used

### 1. MVC (Model-View-Controller)
```
Routes → Controllers → Models → Database
                    ↓
              Business Logic
```

### 2. Middleware Pattern
```
Request → Middleware1 → Middleware2 → Controller → Response
```

### 3. Context Pattern (Frontend)
```
AuthContext (single source of truth)
    ↓
useAuth hook (access from any component)
    ↓
Components (use auth state and functions)
```

### 4. Dependency Injection
```
Middleware passes validated data to controller
Controllers don't create validators, they receive them
```

### 5. Separation of Concerns
```
Routes: Mapping only
Middleware: Specific responsibility (auth, validation, etc.)
Controllers: Business logic only
Models: Data structure only
```

---

## 📈 Scalability Considerations

### Current Architecture
- **Single Backend Server**: Works for small-medium scale
- **Single Database**: MongoDB handles well up to millions of users
- **Stateless API**: Can add load balancing later

### Future Scaling Strategies

1. **Horizontal Scaling**
   - Deploy multiple server instances
   - Use load balancer (nginx, Azure LB)
   - Sessions in Redis (if needed)

2. **Database Optimization**
   - Replication (for redundancy)
   - Sharding (for huge datasets)
   - Caching layer (Redis for frequent queries)

3. **Microservices** (if needed)
   - Auth Service
   - User Service
   - Profile Service
   - etc.

---

## 🧪 Testability Design

### Unit Testing
```javascript
// Controllers can be tested independently
describe('authController.login', () => {
  it('should return user on valid credentials')
  it('should return error on invalid password')
  it('should return error on user not found')
})
```

### Integration Testing
```javascript
// Full flow testing
describe('Login Flow', () => {
  it('should register, login, and access protected route')
  it('should prevent access without token')
})
```

---

## 🔐 Security Best Practices Implemented

1. ✅ **Password Hashing**: bcryptjs with salt
2. ✅ **JWT with Expiration**: 7-day expiry
3. ✅ **HttpOnly Cookies**: XSS protection
4. ✅ **Input Validation**: Whitelist approach
5. ✅ **SQL/NoSQL Injection Prevention**: Sanitization
6. ✅ **CORS**: Configured for allowed origins
7. ✅ **Rate Limiting**: DDoS protection
8. ✅ **Secure Headers**: Helmet.js
9. ✅ **CSRF Protection**: SameSite cookies
10. ✅ **Error Handling**: No sensitive data in errors

---

## 📊 Performance Considerations

### Database Queries
- Indexed fields for quick lookups
- `.select('+password')` only when needed
- Lean queries where possible

### API Responses
- Only necessary fields returned
- Sensitive data excluded
- Consistent response format

### Frontend Optimization
- Context API for state (no Redux overhead)
- Modal dialogs (not full page navigation)
- Lazy loading potential

---

## 🚀 Deployment Architecture

```
GitHub Repository
    ↓
    ├─→ Frontend Build (Vite)
    │      └─→ Render (Frontend Service)
    │          └─→ HTTPS / CDN
    │
    └─→ Backend Build (Node.js)
           └─→ Render (Backend Service)
               └─→ Environment Variables
               └─→ MongoDB Atlas
               └─→ Auto-scaling (if needed)
```

---

**Last Updated**: January 2026
**Architecture Version**: 1.0.0
