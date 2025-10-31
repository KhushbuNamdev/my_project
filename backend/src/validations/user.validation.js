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
    .valid('superadmin', 'wholesaler', 'sales')
    .default('sales')
    .required()
    .messages({
      'any.only': 'Role must be one of: superadmin, wholesaler, or sales',
      'any.required': 'Role is required',
    }),
};

// Wholesaler specific validation rules
const wholesalerRules = {
  businessName: Joi.string().required().trim().messages({
    'string.empty': 'Business name is required for wholesalers',
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
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid GST number',
      'string.empty': 'GST number is required for wholesalers',
    }),
  address: Joi.object({
    street: Joi.string().required().trim().messages({
      'string.empty': 'Street address is required for wholesalers',
    }),
    city: Joi.string().required().trim().messages({
      'string.empty': 'City is required for wholesalers',
    }),
    state: Joi.string().required().trim().messages({
      'string.empty': 'State is required for wholesalers',
    }),
    pincode: Joi.string()
      .pattern(/^\d{6}$/)
      .required()
      .messages({
        'string.pattern.base': 'Pincode must be 6 digits',
        'string.empty': 'Pincode is required for wholesalers',
      }),
    country: Joi.string().default('India').trim(),
  }).when(Joi.object({ role: Joi.string().valid('wholesaler') }).unknown(), {
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
  adharNumber: wholesalerRules.adharNumber
};

// Validation for user registration
// export const registerValidation = Joi.object(baseValidation).when(
//   Joi.object({ role: Joi.string().valid('wholesaler') }), 
//   {
//     then: Joi.object({
//       ...baseValidation,
//       businessName: wholesalerRules.businessName,
//       gstNumber: wholesalerRules.gstNumber,
//       address: wholesalerRules.address
//     })
//   }
// );

export const registerValidation = Joi.object({
  name: commonRules.name,
  phoneNumber: commonRules.phoneNumber,
  email: commonRules.email,
  password: commonRules.password,
  role: commonRules.role,
  adharNumber: wholesalerRules.adharNumber,

  // Conditional fields for wholesaler
  businessName: Joi.when('role', {
    is: 'wholesaler',
    then: wholesalerRules.businessName.required(),
    otherwise: Joi.forbidden()
  }),
  gstNumber: Joi.when('role', {
    is: 'wholesaler',
    then: wholesalerRules.gstNumber.required(),
    otherwise: Joi.forbidden()
  }),
  address: Joi.when('role', {
    is: 'wholesaler',
    then: wholesalerRules.address.required(),
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
