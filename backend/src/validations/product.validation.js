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
      index: Joi.number().integer().min(0).optional()
        .messages({
          'number.base': 'Feature index must be a number',
          'number.integer': 'Feature index must be an integer',
          'number.min': 'Feature index cannot be negative'
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
    }),
  warranty: Joi.number().valid(6, 12, 18, 24).default(12)
    .messages({
      'number.base': 'Warranty must be a number',
      'any.only': 'Warranty must be one of: 6, 12, 18, or 24 months'
    }),
  specifications: Joi.object({
    dimensions: Joi.string().trim().default('')
      .messages({
        'string.base': 'Dimensions must be a string'
      }),
    cca: Joi.number().min(0).default(0)
      .messages({
        'number.base': 'CCA must be a number',
        'number.min': 'CCA cannot be negative'
      }),
    rc: Joi.number().min(0).default(0)
      .messages({
        'number.base': 'RC must be a number',
        'number.min': 'RC cannot be negative'
      }),
    weight: Joi.object({
      value: Joi.number().min(0).required()
        .messages({
          'number.base': 'Weight must be a number',
          'number.min': 'Weight cannot be negative'
        }),
      unit: Joi.string().valid('kg', 'g', 'lb', 'oz').default('kg')
        .messages({
          'string.base': 'Unit must be a string',
          'any.only': 'Unit must be one of: kg, g, lb, oz'
        })
    }).default({ value: 0, unit: 'kg' })
  }).default({})
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
      index: Joi.number().integer().min(0)
        .messages({
          'number.base': 'Feature index must be a number',
          'number.integer': 'Feature index must be an integer',
          'number.min': 'Feature index cannot be negative'
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
    }),
  warranty: Joi.number().valid(6, 12, 18, 24)
    .messages({
      'number.base': 'Warranty must be a number',
      'any.only': 'Warranty must be one of: 6, 12, 18, or 24 months'
    }),
  specifications: Joi.object({
    dimensions: Joi.string().trim().allow('').optional()
      .messages({
        'string.base': 'Dimensions must be a string'
      }),
    cca: Joi.number().min(0)
      .messages({
        'number.base': 'CCA must be a number',
        'number.min': 'CCA cannot be negative'
      }),
    rc: Joi.number().min(0)
      .messages({
        'number.base': 'RC must be a number',
        'number.min': 'RC cannot be negative'
      }),
    weight: Joi.object({
      value: Joi.number().min(0)
        .messages({
          'number.base': 'Weight value must be a number',
          'number.min': 'Weight cannot be negative'
        }),
      unit: Joi.string().valid('kg', 'g', 'lb', 'oz')
        .messages({
          'string.base': 'Unit must be a string',
          'any.only': 'Unit must be one of: kg, g, lb, oz'
        })
    })
  }).min(1).message('At least one field is required for update')
});

export { createProductSchema, updateProductSchema };
