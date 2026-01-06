# WanderOn Authentication System 🌍

A modern, secure user authentication system built for the WanderOn travel platform. This project demonstrates industry-standard practices in user authentication, security, and clean code architecture.

## 🚀 Features

### Core Authentication
- ✅ **User Registration**: Secure account creation with email/username validation
- ✅ **User Login**: Email/Username login with JWT token generation
- ✅ **Protected Routes**: Cookie-based session management
- ✅ **Logout**: Secure session termination with cookie clearing
- ✅ **User Profile Management**: Edit username, email, and profile information
- ✅ **Password Management**: Secure password change with validation

### Security Features
- 🔐 **Password Hashing**: bcryptjs for secure password storage
- 🔐 **JWT Authentication**: Secure token-based authentication
- 🔐 **XSS Protection**: Input sanitization and validation
- 🔐 **MongoDB Injection Prevention**: Data sanitization
- 🔐 **CORS Protection**: Configured cross-origin resource sharing
- 🔐 **Rate Limiting**: Protection against brute force attacks
- 🔐 **HTTP Headers Security**: Helmet.js for secure headers

### Code Quality
- 📦 **Modular Architecture**: Separation of concerns with controllers, routes, middleware
- 📝 **Error Handling**: Comprehensive error responses with meaningful messages
- ✨ **Code Documentation**: Detailed JSDoc comments throughout
- 🧪 **Input Validation**: express-validator for server-side validation

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: 
  - helmet (HTTP headers)
  - cors (Cross-origin)
  - express-rate-limit (Rate limiting)
  - xss (XSS protection)
  - express-mongo-sanitize (NoSQL injection prevention)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Package Manager**: npm

## 🏗️ Project Structure

```
WanderOn Assignment/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── ChangePasswordModal.jsx
│   │   │   ├── EditProfileModal.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js         # App constants
│   │   │   └── db.js                # Database connection
│   │   ├── controllers/
│   │   │   └── authController.js    # Auth logic
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js    # Auth protection
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   └── validations.js       # Input validation
│   │   ├── models/
│   │   │   └── usersSchema.js       # User data model
│   │   ├── routes/
│   │   │   ├── authRoute.js         # Auth endpoints
│   │   │   └── usersRoute.js        # User endpoints
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── package.json
│   └── .env.example
│
├── API_DOCUMENTATION.md             # API endpoints reference
├── ARCHITECTURE.md                  # System design
├── VALIDATION_SYSTEM.md             # Validation details
├── TESTING.md                       # Testing guide
├── SETUP.md                         # Local setup guide
└── README.md                        # This file
```

## 🔐 Security Implementation

### Password Security
- Passwords hashed using bcryptjs (10 salt rounds)
- Never returned in API responses
- Strong password requirements enforced
- Password change requires current password verification

### Token Management
- JWT tokens with 7-day expiration
- Tokens stored in httpOnly cookies (XSS protection)
- Secure flag enabled in production
- SameSite strict policy for CSRF protection

### Input Validation
- Server-side validation using express-validator
- XSS protection with sanitization
- NoSQL injection prevention with mongo-sanitize
- Rate limiting (100 requests per 15 minutes)

### Data Protection
- HTTP-only cookies prevent JavaScript access
- Secure headers with Helmet.js
- CORS configured for allowed origins
- Parameter pollution prevention with hpp

## 📚 Documentation Files

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API endpoints, request/response examples
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design, data flow, and scalability
- **[VALIDATION_SYSTEM.md](VALIDATION_SYSTEM.md)** - Validation rules and error handling
- **[SETUP.md](SETUP.md)** - Local development setup instructions
- **[TESTING.md](TESTING.md)** - Test cases and evaluation criteria

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd WanderOn\ Assignment
```

2. **Backend Setup**
```bash
cd server
npm install
```

3. **Frontend Setup**
```bash
cd ../client
npm install
```

4. **Environment Configuration**
```bash
# In server directory, create .env file
cp .env.example .env

# Update with your values:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# CLIENT_URL=http://localhost:3000
# NODE_ENV=development
```

5. **Run Both Servers**

Backend (Terminal 1):
```bash
cd server
npm run dev
```

Frontend (Terminal 2):
```bash
cd client
npm run dev
```

6. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔄 API Overview

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/updatepassword` - Change password (protected)
- `PUT /api/auth/updateprofile` - Update profile (protected)

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## ✅ Assessment Criteria Met

### Functionality
- ✅ User registration with email/username validation
- ✅ Secure password hashing with bcryptjs
- ✅ User login with JWT generation
- ✅ Protected routes with session maintenance
- ✅ Cookie-based authentication
- ✅ User profile management

### Code Quality
- ✅ Modular architecture with separation of concerns
- ✅ Consistent coding standards
- ✅ Comprehensive error handling
- ✅ SOLID principles applied
- ✅ DRY (Don't Repeat Yourself) principle followed
- ✅ Well-documented code with JSDoc comments

### Security
- ✅ Password hashing (bcryptjs)
- ✅ JWT token generation and validation
- ✅ XSS prevention (input sanitization)
- ✅ MongoDB injection prevention
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ HTTP headers security

### Design
- ✅ Clean, scalable architecture
- ✅ Responsive UI design
- ✅ Modular component structure
- ✅ Separation of business logic

### Error Handling
- ✅ Invalid login attempt handling
- ✅ Registration error handling
- ✅ Validation error responses
- ✅ Meaningful error messages
- ✅ HTTP status codes

### Documentation
- ✅ Complete API documentation
- ✅ Architecture documentation
- ✅ Setup and installation guide
- ✅ Validation system documentation
- ✅ Testing guide

## 🚀 Deployment

### Render Deployment
See [SETUP.md](SETUP.md) for complete deployment instructions to Render

Quick steps:
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy backend and frontend separately

## 📝 License

This project is created as an assignment submission for technical evaluation.

## 👨‍💻 Author

Created as an SDE1 Technical Assessment submission for WanderOn's secure authentication system.

---

**Last Updated**: January 2026
**Version**: 1.0.0
