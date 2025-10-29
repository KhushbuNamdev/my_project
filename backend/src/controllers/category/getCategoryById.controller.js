import { getCategoryById } from '../../services/category.service.js';
import { SuccessResponse } from '../../utils/response.js';

const getCategoryByIdController = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    return new SuccessResponse(
      'Category retrieved successfully',
      category
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default getCategoryByIdController;
