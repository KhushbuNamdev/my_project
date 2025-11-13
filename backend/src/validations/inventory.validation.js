



import Joi from 'joi';

const serialNumberSchema = Joi.string().required().messages({
  'string.empty': 'Serial number is required',
  'any.required': 'Serial number is required'
});

const inventoryItemSchema = Joi.object({
  serialNumber: Joi.string().required().messages({
    'string.empty': 'Serial number is required',
    'any.required': 'Serial number is required'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required'
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required'
  })
});

const createInventorySchema = Joi.object({
  productId: Joi.string().required().messages({
    'string.empty': 'Product ID is required',
    'any.required': 'Product ID is required'
  }),
  items: Joi.array().items(inventoryItemSchema).min(1).required().messages({
    'array.base': 'Items must be an array',
    'array.min': 'At least one item is required',
    'any.required': 'Items are required'
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
  // Calculate total quantity
  const totalQuantity = value.items.reduce((sum, item) => sum + item.quantity, 0);

  // Check for duplicate serial numbers
  const serialNumbers = value.items.map(item => item.serialNumber);
  const uniqueSerials = new Set(serialNumbers);

  if (serialNumbers.length !== uniqueSerials.size) {
    return helpers.message('Duplicate serial numbers are not allowed');
  }

  // Store total quantity for use in the service
  value.totalQuantity = totalQuantity;

  return value;
}, 'Inventory Validation');

const updateInventorySchema = Joi.object({
  quantity: Joi.number().integer().min(0).messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity cannot be negative'
  }),
  price: Joi.number().min(0).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative'
  }),
  usedQuantity: Joi.number().integer().min(0).messages({
    'number.base': 'Used quantity must be a number',
    'number.integer': 'Used quantity must be an integer',
    'number.min': 'Used quantity cannot be negative'
  }),
  serialNumbers: Joi.array().items(serialNumberSchema).min(1).messages({
    'array.base': 'Serial numbers must be an array',
    'array.min': 'At least one serial number is required'
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
