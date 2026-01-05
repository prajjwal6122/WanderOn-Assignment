import jwt from 'jsonwebtoken';
import User from '../models/usersSchema.js';

/**
 * Protect routes - Verify JWT token from cookie
 * Middleware to authenticate users before accessing protected routes
 */
export const protect = async (req, res, next) => {
  let token;

  try {
    // 1. Check if token exists in cookies
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Also check Authorization header as backup (for API testing)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 3. Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.',
        isAuthenticated: false
      });
    }

    try {
      // 4. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 5. Get user from token (exclude password)
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
          isAuthenticated: false
        });
      }

      // 6. Check if user account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated',
          isAuthenticated: false
        });
      }

      // 7. Attach user to request object
      req.user = user;

      // 8. Proceed to next middleware
      next();

    } catch (err) {
      // Handle specific JWT errors
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.',
          isAuthenticated: false
        });
      }

      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.',
          isAuthenticated: false
        });
      }

      throw err; // Re-throw if it's a different error
    }

  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      isAuthenticated: false
    });
  }
};

/**
 * Optional authentication - Adds user to request if token exists
 * Useful for routes that work with or without authentication
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  try {
    // Check for token in cookies or headers
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user
      const user = await User.findById(decoded.id);

      // Attach user if found and active
      if (user && user.isActive) {
        req.user = user;
      }

      next();

    } catch (err) {
      // If token is invalid, just continue without user
      next();
    }

  } catch (error) {
    console.error('❌ Optional auth error:', error);
    next();
  }
};

/**
 * Authorize specific roles
 * Example: authorize('admin', 'moderator')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};