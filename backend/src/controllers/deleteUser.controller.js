import User from '../models/user.model.js';

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    await User.deleteOne({ _id: user._id });
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
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
  )
    .optional()
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
  businessName: Joi.string().trim().required().messages({
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
  }),
};

// ✅ Main registration validation (role-based conditions)
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
    otherwise: Joi.forbidden(),
  }),
  gstNumber: Joi.when('role', {
    is: 'wholesaler',
    then: wholesalerRules.gstNumber.required(),
    otherwise: Joi.forbidden(),
  }),
  address: Joi.when('role', {
    is: 'wholesaler',
    then: wholesalerRules.address.required(),
    otherwise: Joi.forbidden(),
  }),

  // For SALES role: restrict to only name + phoneNumber
  email: Joi.when('role', {
    is: 'sales',
    then: Joi.optional().allow(''),
  }),
  password: Joi.when('role', {
    is: 'sales',
    then: Joi.optional().allow(''),
  }),
});
