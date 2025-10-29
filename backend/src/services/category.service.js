import Category from '../models/category.model.js';
import { NotFoundError } from '../utils/errorHandler.js';

const createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  return await category.save();
};

const getAllCategories = async (filters = {}) => {
  const { status = 'active' } = filters;
  const query = { isDeleted: false };
  
  if (status) {
    query.status = status;
  }
  
  return await Category.find(query).sort({ createdAt: -1 });
};

const getCategoryById = async (id) => {
  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) {
    throw new NotFoundError('Category not found');
  }
  return category;
};

const updateCategory = async (id, updateData) => {
  const category = await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  
  if (!category) {
    throw new NotFoundError('Category not found');
  }
  
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  
  if (!category) {
    throw new NotFoundError('Category not found or already deleted');
  }
  
  return { message: 'Category deleted successfully' };
};

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
