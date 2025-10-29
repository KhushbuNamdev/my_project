import Joi from 'joi';

const createInventorySchema = Joi.object({
  productId: Joi.string().required().messages({
    'string.empty': 'Product ID is required',
    'any.required': 'Product ID is required'
  }),
  quantity: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity cannot be negative'
  }),
  usedQuantity: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Used quantity must be a number',
    'number.integer': 'Used quantity must be an integer',
    'number.min': 'Used quantity cannot be negative'
  }),
  lowStockThreshold: Joi.number().integer().min(1).default(10).messages({
    'number.base': 'Low stock threshold must be a number',
    'number.integer': 'Low stock threshold must be an integer',
    'number.min': 'Low stock threshold must be at least 1'
  })
}).custom((value, helpers) => {
  if (value.usedQuantity > value.quantity) {
    return helpers.error('any.invalid', {
      message: 'Used quantity cannot exceed total quantity'
    });
  }
  return value;
}, 'Inventory Validation');

const updateInventorySchema = Joi.object({
  quantity: Joi.number().integer().min(0).messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity cannot be negative'
  }),
  usedQuantity: Joi.number().integer().min(0).messages({
    'number.base': 'Used quantity must be a number',
    'number.integer': 'Used quantity must be an integer',
    'number.min': 'Used quantity cannot be negative'
  }),
  lowStockThreshold: Joi.number().integer().min(1).messages({
    'number.base': 'Low stock threshold must be a number',
    'number.integer': 'Low stock threshold must be an integer',
    'number.min': 'Low stock threshold must be at least 1'
  }),
  status: Joi.string().valid('in_stock', 'low_stock', 'out_of_stock').messages({
    'string.base': 'Status must be a string',
    'any.only': 'Status must be either in_stock, low_stock, or out_of_stock'
  })
}).min(1).messages({
  'object.min': 'At least one field is required for update'
});

export { createInventorySchema, updateInventorySchema };
