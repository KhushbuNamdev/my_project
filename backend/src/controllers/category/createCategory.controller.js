import { createCategory } from '../../services/category.service.js';
import { SuccessResponse } from '../../utils/response.js';

const createCategoryController = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);
    return new SuccessResponse(
      'Category created successfully',
      category,
      201
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default createCategoryController;
