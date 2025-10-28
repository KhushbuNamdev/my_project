import { validationResult } from 'express-validator';

/**
 * Middleware to validate request data against a schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => async (req, res, next) => {
  try {
    // Validate request body against the schema
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    // Format validation errors
    const errors = {};
    error.details.forEach((err) => {
      const path = err.path.join('.');
      errors[path] = err.message;
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
};

/**
 * Middleware to handle validation errors from express-validator
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      errorMessages[error.param] = error.msg;
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
  next();
};
