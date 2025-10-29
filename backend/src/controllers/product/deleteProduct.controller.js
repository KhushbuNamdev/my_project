import { deleteProduct } from '../../services/product.service.js';
import { SuccessResponse } from '../../utils/response.js';

/**
 * @description Controller for deleting a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteProductController = async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    
    return new SuccessResponse(
      'Product deleted successfully'
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default deleteProductController;
