import { getAllCategories } from '../../services/category.service.js';
import { SuccessResponse } from '../../utils/response.js';

const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await getAllCategories(req.query);
    return new SuccessResponse(
      'Categories retrieved successfully',
      categories
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export default getAllCategoriesController;
