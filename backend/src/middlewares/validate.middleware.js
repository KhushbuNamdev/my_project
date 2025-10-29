import { BadRequestError } from '../utils/errorHandler.js';

/**
 * Middleware to validate request data against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  // Validate request body against the schema
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Return all validation errors, not just the first one
    allowUnknown: true, // Allow unknown keys that will be ignored
    stripUnknown: true, // Remove unknown elements from objects and arrays
  });

  // If validation fails, throw an error
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ');
    throw new BadRequestError(`Validation error: ${errorMessage}`);
  }

  // Replace request body with the validated value
  req.body = value;
  next();
};

export { validate };
