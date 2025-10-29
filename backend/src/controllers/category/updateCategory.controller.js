import { updateCategory } from '../../services/category.service.js';
import { SuccessResponse } from '../../utils/response.js';

const updateCategoryController = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    return new SuccessResponse(
      'Category updated successfully',
      category
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default updateCategoryController;
