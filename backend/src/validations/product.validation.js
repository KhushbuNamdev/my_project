import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Invalid ObjectId');

const createProductSchema = Joi.object({
  name: Joi.string().required().trim().max(100)
    .messages({
      'string.empty': 'Product name is required',
      'string.max': 'Product name cannot exceed 100 characters',
      'any.required': 'Product name is required'
    }),
  images: Joi.array().items(
    Joi.string().uri().optional()
  ).min(1).optional()
    .messages({
      'array.base': 'Images must be an array',
      'array.min': 'At least one image is required',
      'string.uri': 'Image must be a valid URL',
      'any.required': 'At least one image is required'
    }),
  categoryIds: Joi.array().items(
    objectId
  ).min(1).required()
    .messages({
      'array.base': 'Categories must be an array',
      'array.min': 'At least one category is required',
      'any.required': 'At least one category is required',
      'any.invalid': 'Invalid category ID format'
    }),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft')
    .messages({
      'any.only': 'Status must be either draft, published, or archived'
    }),
  features: Joi.array().items(
    Joi.object({
      index: Joi.number().required()
        .messages({
          'number.base': 'Feature index must be a number',
          'any.required': 'Feature index is required'
        }),
      feature: Joi.string().required().trim()
        .messages({
          'string.empty': 'Feature description cannot be empty',
          'any.required': 'Feature description is required'
        })
    })
  ).optional(),
  gstPercentage: Joi.number().min(0).max(100).default(0)
    .messages({
      'number.min': 'GST percentage cannot be negative',
      'number.max': 'GST percentage cannot exceed 100%',
      'number.base': 'GST percentage must be a number'
    })
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().max(100)
    .messages({
      'string.empty': 'Product name cannot be empty',
      'string.max': 'Product name cannot exceed 100 characters'
    }),
  images: Joi.array().items(
    Joi.string().uri()
  ).min(1)
    .messages({
      'array.base': 'Images must be an array',
      'array.min': 'At least one image is required',
      'string.uri': 'Image must be a valid URL'
    }),
  categoryIds: Joi.array().items(
    objectId
  ).min(1)
    .messages({
      'array.base': 'Categories must be an array',
      'array.min': 'At least one category is required',
      'any.invalid': 'Invalid category ID format'
    }),
  status: Joi.string().valid('draft', 'published', 'archived')
    .messages({
      'any.only': 'Status must be either draft, published, or archived'
    }),
  features: Joi.array().items(
    Joi.object({
      index: Joi.number()
        .messages({
          'number.base': 'Feature index must be a number'
        }),
      feature: Joi.string().trim()
        .messages({
          'string.empty': 'Feature description cannot be empty'
        })
    })
  ).optional(),
  gstPercentage: Joi.number().min(0).max(100)
    .messages({
      'number.min': 'GST percentage cannot be negative',
      'number.max': 'GST percentage cannot exceed 100%',
      'number.base': 'GST percentage must be a number'
    })
}).min(1).message('At least one field is required for update');

export { createProductSchema, updateProductSchema };
