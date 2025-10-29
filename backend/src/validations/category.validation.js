import Joi from 'joi';

const createCategorySchema = Joi.object({
  name: Joi.string().trim().required().max(50).messages({
    'string.empty': 'Name is required',
    'string.max': 'Name cannot be longer than 50 characters',
    'any.required': 'Name is required'
  }),
  description: Joi.string().trim().required().max(500).messages({
    'string.empty': 'Description is required',
    'string.max': 'Description cannot be longer than 500 characters',
    'any.required': 'Description is required'
  }),
  image: Joi.string().trim().uri().messages({
    'string.uri': 'Image must be a valid URL'
  })
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(50).messages({
    'string.empty': 'Name cannot be empty',
    'string.max': 'Name cannot be longer than 50 characters'
  }),
  description: Joi.string().trim().max(500).messages({
    'string.empty': 'Description cannot be empty',
    'string.max': 'Description cannot be longer than 500 characters'
  }),
  image: Joi.string().trim().uri().messages({
    'string.uri': 'Image must be a valid URL'
  })
}).min(1).message('At least one field is required for update');

export { createCategorySchema, updateCategorySchema };
