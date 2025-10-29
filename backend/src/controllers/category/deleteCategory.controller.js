import { deleteCategory } from '../../services/category.service.js';
import { SuccessResponse } from '../../utils/response.js';

const deleteCategoryController = async (req, res, next) => {
  try {
    const result = await deleteCategory(req.params.id);
    return new SuccessResponse(
      result.message
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default deleteCategoryController;
