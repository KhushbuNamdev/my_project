import { createProduct } from '../../services/product.service.js';
import { CreatedResponse } from '../../utils/response.js';
import mongoose from 'mongoose';
/**
 * @description Controller for creating a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const createProductController = async (req, res, next) => {
  try {

    // Convert categoryIds to MongoDB ObjectIds
    const categoryIds = Array.isArray(req.body.categoryIds) 
      ? req.body.categoryIds.map(id =>new mongoose.Types.ObjectId(id))
      : [new mongoose.Types.ObjectId(req.body.categoryIds)];
    
    const productData = {
      ...req.body,
      categoryIds
    };
    console.log(categoryIds);
    const product = await createProduct(productData);
    
    return new CreatedResponse(
      'Product created successfully',
      product
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default createProductController;
