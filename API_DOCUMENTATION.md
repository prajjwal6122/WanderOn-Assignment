# API Documentation 📡

Complete reference for all WanderOn Authentication System API endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a valid JWT token in cookies or Authorization header.

### Cookie-based (Recommended)
```
Cookie: token=<jwt_token>
```

### Bearer Token (for testing)
```
Authorization: Bearer <jwt_token>
```

---

## 🔓 Public Endpoints

### 1. User Registration

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!@#",
  "confirm_password": "SecurePass123!@#",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Password Requirements**:
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*()_+-)

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "createdAt": "2026-01-06T10:30:00Z",
    "isActive": true
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

**Validation Errors**:
- Username: 3-30 characters, alphanumeric and underscore only
- Email: Must be valid email format, unique
- Password: Minimum 6 characters, must contain uppercase, lowercase, number
- First Name: 2-50 characters, letters only
- Last Name: 2-50 characters, letters only

---

### 2. User Login

**Endpoint**: `POST /auth/login`

**Description**: Login user and get JWT token

**Request Body**:
```json
{
  "identifier": "johndoe",
  "password": "SecurePass123!@#"
}
```

**Note**: `identifier` accepts either email or username

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "lastLogin": "2026-01-06T10:35:00Z",
    "createdAt": "2026-01-06T10:30:00Z",
    "isActive": true
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 🔐 Protected Endpoints

### 3. Get Current User

**Endpoint**: `GET /auth/me`

**Authentication**: Required (Cookie or Bearer)

**Description**: Get currently logged-in user information

**Request**:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>" \
  --cookie "token=<token>"
```

**Success Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "lastLogin": "2026-01-06T10:35:00Z",
    "createdAt": "2026-01-06T10:30:00Z",
    "isActive": true
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please login."
}
```

---

### 4. Update User Password

**Endpoint**: `PUT /auth/updatepassword`

**Authentication**: Required

**Description**: Change user password

**Request Body**:
```json
{
  "currentPassword": "SecurePass123!@#",
  "newPassword": "NewSecurePass456!@#",
  "confirmPassword": "NewSecurePass456!@#"
}
```

**Rules**:
- New password must be different from current password
- Must follow password complexity requirements
- Confirmation must match new password

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password changed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "newPassword",
      "message": "New password must contain at least one uppercase letter"
    }
  ]
}
```

---

### 5. Update User Profile

**Endpoint**: `PUT /auth/updateprofile`

**Authentication**: Required

**Description**: Update username and/or email

**Request Body**:
```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

**Note**: Both fields are optional. Provide only what you want to update.

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "newusername",
    "email": "newemail@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "createdAt": "2026-01-06T10:30:00Z"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Validation**:
- Username: 3-30 characters, alphanumeric and underscore
- Email: Valid email format, must be unique

---

### 6. Delete User Account

**Endpoint**: `DELETE /auth/deleteaccount`

**Authentication**: Required

**Description**: Permanently delete user account

**Request Body**:
```json
{
  "password": "SecurePass123!@#"
}
```

**Warning**: This action is irreversible!

**Success Response** (200):
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Password is incorrect"
}
```

---

### 7. Logout

**Endpoint**: `GET /auth/logout`

**Authentication**: Required

**Description**: Logout user and clear session

**Request**:
```bash
curl -X GET http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

The token cookie will be cleared automatically.

---

## 📊 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful request |
| 201 | Created | Resource created (registration) |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Invalid credentials or missing token |
| 404 | Not Found | User not found |
| 500 | Server Error | Internal server error |

---

## 🔒 Security Headers

All responses include security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

---

## ⏱️ Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Error Response** (429):
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

---

## 🧪 Testing with cURL

### Register User
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
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "TestPass123!@#"
  }' \
  -c cookies.txt
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Change Password
```bash
curl -X PUT http://localhost:5000/api/auth/updatepassword \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "currentPassword": "TestPass123!@#",
    "newPassword": "NewTestPass456!@#",
    "confirmPassword": "NewTestPass456!@#"
  }'
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/updateprofile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "username": "newusername"
  }'
```

### Logout
```bash
curl -X GET http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## 🔄 Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error for this field"
    }
  ]
}
```

---

## 📌 Important Notes

1. **Token Expiration**: JWT tokens expire in 7 days
2. **Cookie Security**: Cookies are httpOnly and secure in production
3. **CORS**: Frontend must be from allowed origins
4. **Validation**: All input is validated server-side
5. **Passwords**: Never sent in responses or logs

---

**Last Updated**: January 2026
**API Version**: 1.0.0
