// // src/middleware/validator.js
// const { validationResult } = require("express-validator");
// const ErrorResponse = require("../utils/errorResponse");

// exports.validate = (validations) => {
//   return async (req, res, next) => {
//     await Promise.all(validations.map((validation) => validation.run(req)));

//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       return next();
//     }

//     const extractedErrors = errors.array().map((err) => err.msg);
//     return next(new ErrorResponse(extractedErrors[0], 400));
//   };
// };

// src/middleware/validator.js
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const validateLogin = [
  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  // Password validation
  body("password").trim().notEmpty().withMessage("Password is required"),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors
          .array()
          .map(({ param, msg }) => ({ field: param, message: msg })),
      });
    }
    next();
  },
];

const validateRegister = [
  // Name validation
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already registered");
      }
      return true;
    }),

  // Phone validation
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage("Please provide a valid 10-digit phone number")
    .custom(async (phone) => {
      const existingUser = await User.findOne({ number: phone });
      if (existingUser) {
        throw new Error("Phone number already registered");
      }
      return true;
    }),

  // Password validation
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),

  // // Confirm password validation
  // body("confirmPassword")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Please confirm your password")
  //   .custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error("Passwords do not match");
  //     }
  //     return true;
  //   }),

  // Role validation (optional)
  body("role")
    .optional()
    .isIn(["user", "restaurant", "delivery"])
    .withMessage("Invalid role specified"),

  // Address validation (optional)
  body("address.*.street")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),

  body("address.*.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("address.*.state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("address.*.zipCode")
    .optional()
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("Please provide a valid 6-digit zip code"),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((error) => ({
          field: error.param,
          message: error.msg,
        })),
      });
    }
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
};
