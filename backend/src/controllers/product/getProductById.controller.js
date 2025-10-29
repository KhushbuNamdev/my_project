import { getProductById } from '../../services/product.service.js';
import { SuccessResponse } from '../../utils/response.js';

/**
 * @description Controller for getting a product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getProductByIdController = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    
    return new SuccessResponse(
      'Product retrieved successfully',
      product
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default getProductByIdController;
