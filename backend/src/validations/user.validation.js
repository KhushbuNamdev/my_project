import Joi from 'joi';

// Validation for user registration
export const registerValidation = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot be longer than 50 characters',
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
    }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
      'string.empty': 'Phone number is required',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
    }),
  role: Joi.string()
    .valid('superadmin', 'wholesaler', 'sales')
    .default('sales')
    .messages({
      'any.only': 'Invalid role',
    }),
});

// Validation for user login
export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Validation for updating user
export const updateUserValidation = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot be longer than 50 characters',
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
    }),
  role: Joi.string().valid('superadmin', 'wholesaler', 'sales').messages({
    'any.only': 'Invalid role',
  }),
}).min(1);
