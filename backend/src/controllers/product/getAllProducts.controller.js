import { getAllProducts } from '../../services/product.service.js';
import { SuccessResponse } from '../../utils/response.js';

/**
 * @description Controller for getting all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllProductsController = async (req, res, next) => {
  try {
    const { status, categoryId, search } = req.query;
    const products = await getAllProducts({ status, categoryId, search });
    
    return new SuccessResponse(
      'Products retrieved successfully',
      products
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default getAllProductsController;
