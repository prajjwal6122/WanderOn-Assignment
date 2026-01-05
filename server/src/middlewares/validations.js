import { body, validationResult } from "express-validator";
import { VALIDATION } from "../config/constants.js";

/**
 * Validation rules for user registration
 * Includes sanitization to prevent XSS attacks
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errorMessages,
    });
  }
  next();
};

export const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .escape() // Sanitize to prevent XSS
    .customSanitizer((value) => {
      // Additional sanitization - remove any remaining special characters
      return value.replace(/[<>\"'`]/g, "");
    })
    .custom((value) => {
      // Check for reserved usernames
      if (VALIDATION.USERNAME.RESERVED.includes(value.toLowerCase())) {
        throw new Error("Username is reserved");
      }
      return true;
    }),

  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail({
      all_lowercase: true,
      gmail_remove_dots: false,
    })
    .escape(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,\/+\-])[A-Za-z\d@$!%*?&.,\/+\-]+$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  handleValidationErrors,
  // DO NOT use .escape() on passwords as it will corrupt them
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body("identifier")
    .trim()
    .notEmpty()
    .withMessage("Email or username is required")
    .isLength({ min: 3, max: 255 })
    .withMessage("Identifier must be between 3 and 255 characters")
    .custom((value) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/;
      if (!(emailPattern.test(value) || usernamePattern.test(value))) {
        throw new Error("Enter a valid email or username");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 1, max: 128 })
    .withMessage("Password must be less than 128 characters"),

  handleValidationErrors,
  // DO NOT validate password format on login
  // DO NOT use .escape() on passwords
];

/**
 * Validation rules for password update
 */
export const updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,\/+\-])[A-Za-z\d@$!%*?&.,\/+\-]+$/
    )
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value === req.body.newPassword) {
      throw new Error("New password must be different from current password");
    }
    return true;
  }),
  handleValidationErrors,
];

/**
 * Validation rules for profile update
 */
export const updateProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .escape()
    .customSanitizer((value) => value.replace(/[<>\"'`]/g, ""))
    .custom((value) => {
      // Check for reserved usernames
      if (VALIDATION.USERNAME.RESERVED.includes(value.toLowerCase())) {
        throw new Error("Username is reserved");
      }
      return true;
    }),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .escape(),
  handleValidationErrors,
];

/**
 * Validation rules for account deletion
 */
export const deleteAccountValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password is required to delete account"),
];
