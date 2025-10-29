import { updateProduct } from '../../services/product.service.js';
import { SuccessResponse } from '../../utils/response.js';

/**
 * @description Controller for updating a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateProductController = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    // Ensure categoryIds is properly formatted if provided
    if (updateData.categoryIds) {
      updateData.categoryIds = Array.isArray(updateData.categoryIds)
        ? updateData.categoryIds
        : [updateData.categoryIds];
    }
    
    const product = await updateProduct(req.params.id, updateData);
    
    return new SuccessResponse(
      'Product updated successfully',
      product
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default updateProductController;
