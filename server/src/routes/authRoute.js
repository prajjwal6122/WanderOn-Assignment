import express from 'express';
const router = express.Router();

// Import controllers
import {
  register,
  login,
  getMe,
  logout,
  updatePassword,
  updateProfile,
  deleteAccount
} from '../controllers/authController.js';

// Import middleware
import { protect } from '../middlewares/authMiddleware.js';

// Import validation
import {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  updateProfileValidation,
  deleteAccountValidation
} from '../middlewares/validations.js';

// ==============================================
// PUBLIC ROUTES
// ==============================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', loginValidation, login);

// ==============================================
// PROTECTED ROUTES (Require Authentication)
// ==============================================

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user and clear cookie
 * @access  Private
 */
router.get('/logout', protect, logout);

/**
 * @route   PUT /api/auth/updatepassword
 * @desc    Update user password
 * @access  Private
 */
router.put('/updatepassword', protect, updatePasswordValidation, updatePassword);

/**
 * @route   PUT /api/auth/updateprofile
 * @desc    Update user profile (username, email)
 * @access  Private
 */
router.put('/updateprofile', protect, updateProfileValidation, updateProfile);

/**
 * @route   DELETE /api/auth/deleteaccount
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/deleteaccount', protect, deleteAccountValidation, deleteAccount);

export default router;