# Testing & Evaluation Guide 🧪

Comprehensive testing guide aligned with SDE1 technical assessment criteria.

## 📋 Evaluation Criteria

Based on the technical assessment requirements, your submission will be evaluated on:

1. **Functionality** (25%)
2. **Code Quality** (25%)
3. **Security** (25%)
4. **Design** (15%)
5. **Error Handling** (5%)
6. **Documentation** (5%)

---

## 🎯 Functionality Testing (25%)

### Required Features

#### ✅ User Registration
**Description**: Users can create accounts with validation

**Test Case 1: Valid Registration**
```
Input:
  Username: john_doe
  Email: john@example.com
  Password: SecurePass123!@#
  Confirm: SecurePass123!@#
  First Name: John
  Last Name: Doe

Expected:
  ✓ Account created
  ✓ Redirected to dashboard
  ✓ User logged in automatically
  ✓ JWT token generated
  ✓ Password hashed in database
```

**Test Case 2: Duplicate Email**
```
Input:
  Email: john@example.com (already registered)

Expected:
  ✓ Error message: "Email already exists"
  ✓ Account not created
  ✓ Status code: 400
```

**Test Case 3: Weak Password**
```
Input:
  Password: password (no uppercase, number, or special char)

Expected:
  ✓ Validation error
  ✓ Error message about password requirements
```

**Test Case 4: Password Mismatch**
```
Input:
  Password: SecurePass123!@#
  Confirm: DifferentPass456!@#

Expected:
  ✓ Error message: "Passwords do not match"
```

#### ✅ User Login
**Description**: Users can authenticate with email or username

**Test Case 1: Valid Login with Email**
```
Input:
  Identifier: john@example.com
  Password: SecurePass123!@#

Expected:
  ✓ Logged in successfully
  ✓ Redirected to dashboard
  ✓ JWT token in cookie
  ✓ User data displayed
```

**Test Case 2: Valid Login with Username**
```
Input:
  Identifier: john_doe
  Password: SecurePass123!@#

Expected:
  ✓ Logged in successfully
  ✓ Same result as email login
```

**Test Case 3: Invalid Password**
```
Input:
  Identifier: john@example.com
  Password: WrongPassword123!@#

Expected:
  ✓ Error message: "Invalid credentials"
  ✓ Not logged in
  ✓ Status code: 401
```

**Test Case 4: Non-existent User**
```
Input:
  Identifier: nonexistent@example.com
  Password: AnyPassword123!@#

Expected:
  ✓ Error message: "Invalid credentials"
  ✓ Same as wrong password (no user enumeration)
```

#### ✅ Protected Routes
**Description**: Only logged-in users can access dashboard

**Test Case 1: Access Without Login**
```
Step 1: Open browser (no login)
Step 2: Navigate to /dashboard

Expected:
  ✓ Redirected to /login
  ✓ Cannot access protected content
```

**Test Case 2: Access With Valid Token**
```
Step 1: Login successfully
Step 2: Navigate to /dashboard

Expected:
  ✓ Dashboard loads
  ✓ User data displayed
  ✓ All features accessible
```

**Test Case 3: Token Expiration**
```
Step 1: Wait for token to expire (or use dev tools)
Step 2: Try to access protected endpoint

Expected:
  ✓ Error: "Token expired"
  ✓ Redirected to login
  ✓ Must login again
```

#### ✅ Logout
**Description**: Users can end their session

**Test Case 1: Logout Successfully**
```
Step 1: Login
Step 2: Click Logout button

Expected:
  ✓ Redirected to login page
  ✓ Cookie cleared
  ✓ Cannot access dashboard without new login
```

**Test Case 2: Cookie Cleared**
```
Use Browser DevTools (F12 → Application → Cookies)
Before logout: token cookie present
After logout: token cookie removed
```

#### ✅ Session Management
**Description**: Sessions persist across page refreshes

**Test Case 1: Persistence**
```
Step 1: Login
Step 2: Refresh page (Ctrl+R)

Expected:
  ✓ Still logged in
  ✓ Dashboard loads without re-login
  ✓ User data persists
```

---

## 💾 Database & Security Testing (25%)

### Password Storage

**Test Case 1: Password Hashing**
```
Check MongoDB directly:
  mongosh
  > use wanderon
  > db.users.findOne({ email: "john@example.com" })

Expected:
  ✓ Password is NOT plain text
  ✓ Password is NOT visible
  ✓ Format: hash starting with $2a$ or $2b$ (bcrypt)
  Example: $2b$10$...
```

**Test Case 2: Password Not in Responses**
```
Login, then check API response

Expected:
  ✓ Password field NOT in user object
  ✓ No sensitive data in response
```

### JWT Token Validation

**Test Case 1: Token Structure**
```
Decode token at https://jwt.io/

Expected:
  ✓ Header: { "alg": "HS256", "typ": "JWT" }
  ✓ Payload: Contains user ID and expiration
  ✓ Signature: Valid for your secret
```

**Test Case 2: Token Expiration**
```
Check token payload at jwt.io

Expected:
  ✓ exp field: timestamp
  ✓ 7 days from creation: 604800 seconds
```

**Test Case 3: Invalid Token**
```
Use invalid/expired token in request:
  curl -X GET http://localhost:5000/api/auth/me \
    -H "Authorization: Bearer invalid_token"

Expected:
  ✓ Error: "Invalid token"
  ✓ Status: 401
```

---

## 🔐 Security Testing (25%)

### Input Validation

**Test Case 1: XSS Prevention**
```
Input:
  Username: john<script>alert('xss')</script>

Expected:
  ✓ Script tags escaped: &lt;script&gt;
  ✓ No alert execution
  ✓ Stored safely
```

**Test Case 2: SQL/NoSQL Injection**
```
Input:
  Identifier: { "$ne": "" }

Expected:
  ✓ Treated as literal string
  ✓ User not found
  ✓ No bypass of authentication
```

**Test Case 3: Special Characters**
```
Input:
  Username: user@!#$%
  Email: test+tag@example.com

Expected:
  ✓ Username rejected (invalid chars)
  ✓ Email accepted (valid format)
```

### CORS & CSRF Protection

**Test Case 1: Cross-Origin Request**
```
From: http://malicious-site.com
To: http://localhost:5000/api/auth/me

Expected:
  ✓ Request blocked
  ✓ CORS error
```

**Test Case 2: Cookie Security**
```
Browser DevTools → Application → Cookies

Expected:
  ✓ HttpOnly: Yes (not accessible via JavaScript)
  ✓ Secure: Yes (HTTPS only in production)
  ✓ SameSite: Strict
```

### Rate Limiting

**Test Case 1: Rate Limit Enforcement**
```
Make 101 requests to /api/auth/login within 15 minutes

Expected:
  ✓ First 100: Successful
  ✓ 101st+: Error 429 "Too many requests"
  ✓ After 15 minutes: Can request again
```

### Unique Field Constraints

**Test Case 1: Duplicate Username**
```
Try to register with existing username

Expected:
  ✓ Error: "Username already taken"
  ✓ Database has unique index
  ✓ Cannot create duplicate
```

**Test Case 2: Duplicate Email**
```
Try to register with existing email

Expected:
  ✓ Error: "Email already exists"
  ✓ Case-insensitive (TEST@EXAMPLE.COM = test@example.com)
```

---

## 🏗️ Code Quality Testing (25%)

### Code Structure

**Check Points**:
```
server/src/
├── controllers/          ✓ Business logic isolated
├── middlewares/         ✓ Cross-cutting concerns
├── models/             ✓ Data structure defined
├── routes/             ✓ Endpoints organized
└── config/             ✓ Configuration centralized

client/src/
├── components/         ✓ Reusable components
├── context/           ✓ State management
├── pages/             ✓ Page components
└── App.jsx            ✓ Root component
```

### Error Handling

**Test Case 1: Invalid Input Error**
```
POST /api/auth/register with invalid data

Expected Response:
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

**Test Case 2: Server Error Handling**
```
(Simulate by stopping database)

Expected:
  ✓ No crash
  ✓ Error response with message
  ✓ Meaningful error details
```

### Code Documentation

**Check Points**:
```javascript
// ✓ JSDoc comments on functions
/**
 * @desc    Login user
 * @param   {string} email
 * @returns {Object} user data
 */

// ✓ Inline comments on complex logic
// Hash password with 10 salt rounds

// ✓ Clear variable names
const hashedPassword = // not: pw, hp, x

// ✓ Consistent formatting
```

### SOLID Principles

**Single Responsibility**:
```
✓ Controllers handle requests
✓ Models handle data
✓ Middleware handles specific concerns
✓ Utilities handle helper functions
```

**DRY (Don't Repeat Yourself)**:
```
✓ Token generation: One place (sendTokenResponse)
✓ Validation rules: Reused across endpoints
✓ Error responses: Consistent format
```

---

## 🎨 Design Testing (15%)

### User Interface

**Test Case 1: Responsive Design**
```
Test on different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Expected:
  ✓ All elements visible
  ✓ No overflow
  ✓ Touch-friendly on mobile
```

**Test Case 2: User Experience**
```
Flow:
1. Register → 2. Login → 3. Edit Profile → 4. Change Password → 5. Logout

Expected:
  ✓ Intuitive flow
  ✓ Clear feedback
  ✓ No dead ends
```

### Navigation

**Test Case 1: Links & Routes**
```
✓ /login - Login page
✓ /register - Registration page
✓ /dashboard - Protected dashboard
✓ Invalid routes → 404
```

### Visual Design

**Check Points**:
```
✓ Consistent color scheme
✓ Professional layout
✓ Clear typography
✓ Good contrast
✓ Professional icons
```

---

## ⚠️ Error Handling Testing (5%)

### User-Friendly Error Messages

**Test Case 1: Registration Errors**
```
Input: email@, password=weak, username=#invalid

Expected:
  ✓ Clear messages for each error
  ✓ Not technical jargon
  ✓ Hints for correction
  Example: "Password must contain at least one uppercase letter"
```

**Test Case 2: Login Errors**
```
Invalid credentials

Expected:
  ✓ Message: "Invalid credentials"
  ✓ No user enumeration (same for wrong email vs wrong password)
```

### Validation Feedback

**Test Case 1: Real-time Feedback**
```
As user types in form

Expected:
  ✓ Real-time validation messages
  ✓ Success indicators
  ✓ Error indicators
```

---

## 📊 Test Execution Checklist

Use this checklist to verify all requirements are met:

### Functionality (25 points)
- [ ] Registration with validation works
- [ ] Duplicate email/username prevention
- [ ] Login with email works
- [ ] Login with username works
- [ ] Protected routes inaccessible without login
- [ ] Logout clears session
- [ ] Session persists on refresh

### Security (25 points)
- [ ] Passwords are hashed (bcryptjs)
- [ ] Passwords never returned in API
- [ ] JWT tokens generated correctly
- [ ] Tokens have expiration
- [ ] XSS prevention (input escaping)
- [ ] NoSQL injection prevention
- [ ] CORS configured
- [ ] Cookies are httpOnly
- [ ] Rate limiting implemented
- [ ] Unique field constraints

### Code Quality (25 points)
- [ ] MVC architecture followed
- [ ] Separation of concerns
- [ ] Error handling comprehensive
- [ ] No hardcoded values
- [ ] Code documented
- [ ] Consistent formatting
- [ ] SOLID principles applied
- [ ] DRY principle applied

### Design (15 points)
- [ ] Responsive design
- [ ] Intuitive UI
- [ ] Professional appearance
- [ ] Smooth interactions
- [ ] Clear navigation

### Error Handling (5 points)
- [ ] User-friendly error messages
- [ ] No sensitive data in errors
- [ ] Validation feedback
- [ ] Server errors handled gracefully

### Documentation (5 points)
- [ ] README.md comprehensive
- [ ] API endpoints documented
- [ ] Architecture explained
- [ ] Setup instructions clear
- [ ] Code comments present

---

## 🔄 Testing with cURL

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!@#",
    "confirm_password": "TestPass123!@#",
    "first_name": "Test",
    "last_name": "User"
  }' \
  -c cookies.txt
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "TestPass123!@#"
  }' \
  -c cookies.txt
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Test Invalid Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```

---

## 📝 Test Report Template

Use this to document your testing:

```
# WanderOn Authentication System - Test Report

## Date: [Date]
## Tester: [Name]
## Environment: [Local/Cloud]

## Functionality Tests
- [ ] Registration: PASS/FAIL
- [ ] Login: PASS/FAIL
- [ ] Protected Routes: PASS/FAIL
- [ ] Logout: PASS/FAIL
- [ ] Session Persistence: PASS/FAIL

## Security Tests
- [ ] Password Hashing: PASS/FAIL
- [ ] JWT Validation: PASS/FAIL
- [ ] XSS Prevention: PASS/FAIL
- [ ] Injection Prevention: PASS/FAIL
- [ ] CORS/CSRF: PASS/FAIL

## Issues Found
1. [Issue description]
   - Status: [Open/Closed]
   - Severity: [Critical/High/Medium/Low]

## Conclusion
Overall Status: PASS/FAIL
Ready for Submission: YES/NO
```

---

## 🎓 Learning Outcome

After completing this testing, you should understand:

1. **What to test**: All features and security aspects
2. **How to test**: Unit, integration, and end-to-end
3. **When to test**: Before deployment
4. **Why to test**: Ensure quality and security

---

**Last Updated**: January 2026
**Testing Framework Version**: 1.0.0
