import Joi from 'joi';

// Common validation rules
const commonRules = {
  name: Joi.string().required().min(2).max(50).messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot be longer than 50 characters',
  }),
  email: Joi.alternatives().try(
    Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
    Joi.string().allow('').optional()
  ).optional()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.only': 'Please provide a valid email address',
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
    .optional()
    .allow('')
    .messages({
      'string.min': 'Password must be at least 6 characters long',
    }),
  role: Joi.string()
    .valid('superadmin', 'wholesaler', 'retailer', 'sales')
    .default('sales')
    .required()
    .messages({
      'any.only': 'Role must be one of: superadmin, wholesaler, retailer, or sales',
      'any.required': 'Role is required',
    }),
};

// Business validation rules for both wholesaler and retailer
const businessRules = {
  businessName: Joi.string().required().trim().messages({
    'string.empty': 'Business name is required',
  }),
  adharNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Aadhar number must be 12 digits',
    }),
  gstNumber: Joi.string()
    .pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .when('role', {
      is: Joi.valid('wholesaler', 'retailer'),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'string.pattern.base': 'Please provide a valid GST number',
      'string.empty': 'GST number is required',
      'any.required': 'GST number is required for business accounts'
    }),
  address: Joi.object({
    street: Joi.string().required().trim().messages({
      'string.empty': 'Street address is required',
    }),
    city: Joi.string().required().trim().messages({
      'string.empty': 'City is required',
    }),
    state: Joi.string().required().trim().messages({
      'string.empty': 'State is required',
    }),
    pincode: Joi.string()
      .pattern(/^\d{6}$/)
      .required()
      .messages({
        'string.pattern.base': 'Pincode must be 6 digits',
        'string.empty': 'Pincode is required',
      }),
    country: Joi.string().default('India').trim(),
  }).when(Joi.object({ role: Joi.string().valid('wholesaler', 'retailer') }).unknown(), {
    then: Joi.object().required(),
    otherwise: Joi.object().optional(),
  }),
};

// Base validation for all users
const baseValidation = {
  name: commonRules.name,
  phoneNumber: commonRules.phoneNumber,
  email: commonRules.email,
  password: commonRules.password,
  role: commonRules.role,
  adharNumber: businessRules.adharNumber
};

// Validation for user registration
export const registerValidation = Joi.object({
  name: commonRules.name,
  phoneNumber: commonRules.phoneNumber,
  email: commonRules.email,
  password: commonRules.password,
  role: commonRules.role,
  adharNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Aadhar number must be 12 digits',
    }),

  // Business name for both wholesaler and retailer
  businessName: Joi.when('role', {
    is: Joi.valid('wholesaler', 'retailer'),
    then: Joi.string().required().trim().messages({
      'string.empty': 'Business name is required',
    }),
    otherwise: Joi.forbidden()
  }),

  // Business type only for retailer

  // GST number for both wholesaler and retailer
  gstNumber: Joi.when('role', {
    is: Joi.valid('wholesaler', 'retailer'),
    then: Joi.string()
      .pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please provide a valid GST number',
        'string.empty': 'GST number is required',
        'any.required': 'GST number is required for business accounts'
      }),
    otherwise: Joi.forbidden()
  }),

  // Address for both wholesaler and retailer
  address: Joi.when('role', {
    is: Joi.valid('wholesaler', 'retailer'),
    then: Joi.object({
      street: Joi.string().trim().required().messages({
        'string.empty': 'Street address is required',
        'any.required': 'Street address is required',
      }),
      city: Joi.string().trim().required().messages({
        'string.empty': 'City is required',
        'any.required': 'City is required',
      }),
      state: Joi.string().trim().required().messages({
        'string.empty': 'State is required',
        'any.required': 'State is required',
      }),
      pincode: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
          'string.pattern.base': 'Pincode must be 6 digits',
          'string.empty': 'Pincode is required',
          'any.required': 'Pincode is required',
        }),
      country: Joi.string().default('India').trim(),
    }).required().options({ allowUnknown: false })
      .messages({
        'object.base': 'Address is required',
        'any.required': 'Address is required',
      }),
    otherwise: Joi.forbidden()
  }),
});



// Validation for user login
export const loginValidation = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
  }),
  phoneNumber: Joi.string().pattern(/^\d{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be 10 digits',
    'string.empty': 'Phone number is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Validation for updating user
export const updateUserValidation = Joi.object({
  // Password update fields
  currentPassword: Joi.string().optional(),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'New password must be at least 6 characters long',
  }),
  name: Joi.string().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot be longer than 50 characters',
  }),
  businessName: Joi.string().trim().messages({
    'string.empty': 'Business name cannot be empty',
  }),
  adharNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Aadhar number must be 12 digits',
    }),
  gstNumber: Joi.string()
    .pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid GST number',
    }),
  address: Joi.object({
    street: Joi.string().trim().messages({
      'string.empty': 'Street address cannot be empty',
    }),
    city: Joi.string().trim().messages({
      'string.empty': 'City cannot be empty',
    }),
    state: Joi.string().trim().messages({
      'string.empty': 'State cannot be empty',
    }),
    pincode: Joi.string()
      .pattern(/^\d{6}$/)
      .allow('')
      .messages({
        'string.pattern.base': 'Pincode must be 6 digits',
      }),
    country: Joi.string().default('India').trim(),
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
  role: Joi.string().valid('superadmin', 'wholesaler', 'sales', 'retailer').messages({
    'any.only': 'Invalid role',
  }),
}).custom((value, helpers) => {
  // If either password or currentPassword is provided, both are required
  if (value.password && !value.currentPassword) {
    return helpers.error('any.required', { key: 'currentPassword' });
  }
  if (value.currentPassword && !value.password) {
    return helpers.error('any.required', { key: 'password' });
  }
  return value;
}).messages({
  'any.required': '{{#key}} is required when updating password',
}).min(1);
