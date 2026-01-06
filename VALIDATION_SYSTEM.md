# Validation System 🛡️

Complete documentation of the input validation and sanitization system used throughout the WanderOn Authentication application.

## 🎯 Validation Philosophy

Our validation follows a **multi-layer approach** for security and user experience:

```
Frontend Validation (UX)
        ↓
  (User feedback)
        ↓
Express-validator (Server Security)
        ↓
  (Whitelist approach)
        ↓
Mongo-sanitize (Injection Prevention)
        ↓
  (Character escaping)
        ↓
Mongoose Schema (Database Constraints)
        ↓
  (Final validation)
```

---

## 📝 Registration Validation

### Fields & Rules

#### Username
```javascript
body("username")
  .trim()                              // Remove whitespace
  .notEmpty()                          // Required
  .isLength({ min: 3, max: 30 })      // Length validation
  .matches(/^[a-zA-Z0-9_]+$/)         // Alphanumeric + underscore
  .escape()                            // XSS prevention
  .custom((value) => {
    // Check for reserved usernames
    if (VALIDATION.USERNAME.RESERVED.includes(value.toLowerCase())) {
      throw new Error("Username is reserved");
    }
    return true;
  })
```

**Rules**:
- ✅ Required field
- ✅ 3-30 characters
- ✅ Only letters, numbers, underscores
- ✅ Not a reserved word
- ✅ Case-insensitive uniqueness check

**Examples**:
```
Valid: john_doe, user123, JohnDoe
Invalid: ab (too short), user@123 (special char), admin (reserved)
```

#### Email
```javascript
body("email")
  .trim()
  .notEmpty()
  .isEmail()
  .normalizeEmail({
    all_lowercase: true,
    gmail_remove_dots: false
  })
  .escape()
```

**Rules**:
- ✅ Required field
- ✅ Valid email format
- ✅ Normalized to lowercase
- ✅ Must be unique in database

**Examples**:
```
Valid: user@example.com, john.doe@company.co.uk
Invalid: notanemail, @example.com, user@.com
```

#### Password
```javascript
body("password")
  .notEmpty()
  .isLength({ min: 6 })
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/
  )
  // Note: NOT escaped to preserve password integrity
```

**Rules**:
- ✅ Required field
- ✅ Minimum 6 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*)

**Complexity Breakdown**:
```
(?=.*[a-z])     - Lookahead: must contain lowercase
(?=.*[A-Z])     - Lookahead: must contain uppercase
(?=.*\d)        - Lookahead: must contain digit
(?=.*[!@#...])  - Lookahead: must contain special char
[...]+          - Match valid characters
```

**Examples**:
```
Valid: SecurePass123!@#, MyPassword1$, Test@Pass123
Invalid: password (no uppercase), Password (no number), Pass123 (no special)
```

#### Confirm Password
```javascript
body("confirm_password").custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("Password confirmation does not match password");
  }
  return true;
})
```

**Rules**:
- ✅ Must match password field exactly
- ✅ Case-sensitive

#### First Name
```javascript
body("first_name")
  .trim()
  .isLength({ min: 2, max: 50 })
  .matches(/^[a-zA-Z\s]+$/)
```

**Rules**:
- ✅ 2-50 characters
- ✅ Only letters and spaces

#### Last Name
```javascript
body("last_name")
  .trim()
  .isLength({ min: 2, max: 50 })
  .matches(/^[a-zA-Z\s]+$/)
```

**Rules**:
- ✅ 2-50 characters
- ✅ Only letters and spaces

---

## 🔐 Login Validation

### Fields & Rules

#### Identifier
```javascript
body("identifier")
  .trim()
  .notEmpty()
  .isLength({ min: 3, max: 255 })
  .custom((value) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/;
    if (!(emailPattern.test(value) || usernamePattern.test(value))) {
      throw new Error("Enter a valid email or username");
    }
    return true;
  })
```

**Rules**:
- ✅ Can be either email or username
- ✅ Email format validation OR username format validation
- ✅ 3-255 characters

**Examples**:
```
Valid: user@example.com, john_doe, valid.email@test.co.uk
Invalid: ab, user@, @example, user!name
```

#### Password
```javascript
body("password")
  .notEmpty()
  .isLength({ min: 1, max: 128 })
  // NO format validation on login (already validated on registration)
```

**Rules**:
- ✅ Required field
- ✅ Max 128 characters
- ⚠️ NO format validation (allows any password format)
- **Why**: User may have registered with different rules, or for testing

---

## 🔑 Change Password Validation

### Fields & Rules

#### Current Password
```javascript
body("currentPassword")
  .notEmpty()
  // No format validation - user's existing password may vary
```

**Rules**:
- ✅ Required field

#### New Password
```javascript
body("newPassword")
  .notEmpty()
  .isLength({ min: 8, max: 128 })
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/
  )
```

**Rules**:
- ✅ Required field
- ✅ Minimum 8 characters (stricter than registration)
- ✅ Same complexity requirements as registration password
- ✅ Must be different from current password (checked in controller)

#### Confirm Password
```javascript
body("confirmPassword").custom((value, { req }) => {
  if (value !== req.body.newPassword) {
    throw new Error("Password confirmation does not match new password");
  }
  return true;
})
```

**Rules**:
- ✅ Must match newPassword exactly

---

## 👤 Update Profile Validation

### Fields & Rules

#### Username (Optional)
```javascript
body("username")
  .optional()
  .trim()
  .isLength({ min: 3, max: 30 })
  .matches(/^[a-zA-Z0-9_]+$/)
  .custom(async (value) => {
    // Check if username is already taken (excluding current user)
    const existing = await User.findOne({
      username: value,
      _id: { $ne: req.user.id }
    });
    if (existing) {
      throw new Error("Username already taken");
    }
  })
```

**Rules**:
- ✅ Optional field
- ✅ Same rules as registration username if provided
- ✅ Must be unique (excluding current user)

#### Email (Optional)
```javascript
body("email")
  .optional()
  .trim()
  .isEmail()
  .normalizeEmail()
  .custom(async (value) => {
    // Check if email is already taken
    const existing = await User.findOne({
      email: value.toLowerCase(),
      _id: { $ne: req.user.id }
    });
    if (existing) {
      throw new Error("Email already registered");
    }
  })
```

**Rules**:
- ✅ Optional field
- ✅ Must be valid email format
- ✅ Must be unique (excluding current user)

---

## 🛡️ Sanitization Methods

### 1. Trimming
```javascript
.trim()  // Remove leading/trailing whitespace
```

### 2. Escaping
```javascript
.escape()  // Convert: < > " ' ` to HTML entities
           // Prevents XSS attacks
```

### 3. Email Normalization
```javascript
.normalizeEmail({
  all_lowercase: true,        // user@Example.com → user@example.com
  gmail_remove_dots: false    // john.doe@gmail.com stays as is
})
```

### 4. Pattern Matching
```javascript
.matches(/^[a-zA-Z]+$/)  // Only allows specific characters
                         // Whitelist approach (more secure)
```

### 5. MongoDB Sanitization
```javascript
// In app.js middleware
mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`NoSQL injection attempt on key: ${key}`);
  }
})
// Converts: { username: { $ne: "" } } → { username: "_ne_" }
// Prevents NoSQL injection queries
```

### 6. XSS Protection Library
```javascript
// In app.js
const cleanedInput = xss(userInput, {
  whiteList: {},           // No HTML allowed
  stripIgnoredTag: true
})
```

---

## 📊 Validation Flow Chart

```
User Input
    ↓
[Frontend Validation]
├─ Required check
├─ Length validation
└─ Format check
    ↓
[Submit Request]
    ↓
[Express-validator Middleware]
├─ .trim() - Remove whitespace
├─ .notEmpty() - Check required
├─ .isLength() - Check length
├─ .matches() - Check format
├─ .isEmail() - Email format
├─ .escape() - XSS prevention
└─ .custom() - Custom logic
    ↓
[Mongo-sanitize Middleware]
├─ Check for NoSQL operators
├─ Remove special patterns
└─ Log attempts
    ↓
[Controller Logic]
├─ Verify uniqueness
├─ Check existing records
└─ Process validated data
    ↓
[Mongoose Schema Validation]
├─ Type checking
├─ Required fields
└─ Custom validators
    ↓
[Database]
└─ Data stored
```

---

## ⚠️ Error Responses

### Validation Error Format
```json
{
  "success": false,
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid@email"
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter"
    }
  ]
}
```

### Common Validation Error Messages

| Field | Error Message |
|-------|-------|
| Username | "Username is required" |
| | "Username must be between 3 and 30 characters" |
| | "Username can only contain letters, numbers, and underscores" |
| | "Username is reserved" |
| Email | "Email is required" |
| | "Please provide a valid email address" |
| | "Email already exists" |
| Password | "Password is required" |
| | "Password must be at least 6 characters long" |
| | "Password must contain at least one uppercase letter" |
| | "Password must contain at least one lowercase letter" |
| | "Password must contain at least one number" |
| | "Password must contain at least one special character" |
| Confirm | "Password confirmation does not match password" |
| First Name | "First name must be between 2 and 50 characters" |
| | "First name can only contain letters and spaces" |

---

## 🧪 Testing Validation

### Valid Registration
```javascript
{
  username: "john_doe",
  email: "john@example.com",
  password: "SecurePass123!@#",
  confirm_password: "SecurePass123!@#",
  first_name: "John",
  last_name: "Doe"
}
// ✅ PASSES all validation
```

### Invalid Examples
```javascript
// ❌ Username too short
{ username: "ab", ... }

// ❌ Email invalid
{ email: "notanemail", ... }

// ❌ Password weak
{ password: "password", ... }  // No uppercase, number, special

// ❌ Passwords don't match
{
  password: "SecurePass123!@#",
  confirm_password: "DifferentPass456!@#"
}

// ❌ Special characters in name
{ first_name: "John@" }
```

---

## 🔍 SQL/NoSQL Injection Prevention

### Example Attack Attempts

#### NoSQL Injection (Prevented)
```javascript
// Attack attempt:
{ identifier: { $ne: "" }, password: "anything" }

// What happens:
1. mongoSanitize detects pattern
2. Converts to: { identifier: "_ne_", password: "anything" }
3. Query fails safely
```

#### XSS Attack (Prevented)
```javascript
// Attack attempt:
{ username: "<script>alert('xss')</script>" }

// What happens:
1. .escape() converts: <script> → &lt;script&gt;
2. Stored safely in database
3. Can't execute on display
```

---

## 📚 Best Practices Implemented

1. ✅ **Whitelist Approach**: Only allow known good characters
2. ✅ **Server-side Validation**: Never trust client validation alone
3. ✅ **Consistent Error Messages**: Don't leak user existence info
4. ✅ **Rate Limiting**: Prevent brute force attacks
5. ✅ **Input Trimming**: Remove accidental whitespace
6. ✅ **Type Coercion**: Explicit type checking
7. ✅ **Custom Validators**: Unique constraints, business rules
8. ✅ **Async Validation**: Database queries for uniqueness

---

## 🚀 Performance Considerations

### Validation Order
1. Trim & basic format (fast)
2. Length validation (fast)
3. Pattern matching (moderate)
4. Custom async (slow - database)

**Why**: Fail fast principle - check quick things first

### Caching
- Username/email uniqueness checks query database
- These are necessary for data integrity
- Indexes ensure fast lookups

---

**Last Updated**: January 2026
**Validation System Version**: 1.0.0
