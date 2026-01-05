import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { SECURITY, VALIDATION } from "../config/constants.js";

/**
 * User Schema
 * Defines the structure and validation rules for user documents
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name must be less than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name must be less than 50 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [
        VALIDATION.USERNAME.MIN_LENGTH,
        `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters long`,
      ],
      maxlength: [
        VALIDATION.USERNAME.MAX_LENGTH,
        `Username must be less than ${VALIDATION.USERNAME.MAX_LENGTH} characters`,
      ],
      match: [
        VALIDATION.USERNAME.REGEX,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        VALIDATION.PASSWORD.MIN_LENGTH,
        `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`,
      ],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: "users",
  }
);

// ==============================================
// INDEXES
// ==============================================

// Create indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// ==============================================
// MIDDLEWARE - Pre-save Hook
// ==============================================

/**
 * Hash password before saving to database
 * Only runs when password is modified
 */
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt with 10 rounds (balance between security and performance)
    const salt = await bcrypt.genSalt(SECURITY.BCRYPT_ROUNDS);

    // Hash password with the salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});


// ==============================================
// INSTANCE METHODS
// ==============================================

/**
 * Compare entered password with hashed password in database
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

/**
 * Get user data without sensitive information
 * @returns {Object} - User object without password
 */



userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  // Remove sensitive data
  delete userObject.password;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  delete userObject.__v;
  

  return userObject;
};

/**
 * Update last login timestamp
 * @returns {Promise<void>}
 */
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  return await this.save();
};

// ==============================================
// STATIC METHODS
// ==============================================

// Instance method to handle failed login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = SECURITY.MAX_LOGIN_ATTEMPTS;
  const lockTime = SECURITY.LOCKOUT_TIME_MINUTES; // minutes
  
  // If we have reached max attempts and it's not locked already, lock it
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};



/**
 * Find user by email or Email
 * @param {string} email - User email
 * @param {string} username - Username
 * @returns {Promise<Object|null>} - User object or null
 */

userSchema.statics.findByEmailorUsername = async function(identifier, password) {
  // Find user by email or username
  const user = await this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ],
    isActive: true
  }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if account is locked
  if (user.isLocked) {
    // Increment login attempts for locked account
    await user.incLoginAttempts();
    throw new Error('Account temporarily locked due to too many failed login attempts');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    // Increment login attempts on failed password
    await user.incLoginAttempts();
    throw new Error('Invalid credentials');
  }

  // Reset login attempts on successful login
  if (user.loginAttempts && user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  return user;
};


/**
 * Check if email exists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - True if exists, false otherwise
 */
userSchema.statics.emailExists = async function (email) {
  const user = await this.findOne({ email: email.toLowerCase() });
  return !!user;
};

/**
 * Check if username exists
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} - True if exists, false otherwise
 */
userSchema.statics.usernameExists = async function (username) {
  const user = await this.findOne({ username });
  return !!user;
};

// ==============================================
// MODEL EXPORT
// ==============================================


const User = mongoose.model("Users", userSchema);

export default User;
