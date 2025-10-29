import Product from '../models/product.model.js';
import { NotFoundError } from '../utils/errorHandler.js';

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

/**
 * Get all products with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} List of products
 */
const getAllProducts = async (filters = {}) => {
  const { status, categoryId, search } = filters;
  const query = { isDeleted: false };

  if (status) {
    query.status = status;
  }

  if (categoryId) {
    query.categoryIds = categoryId;
  }

  if (search) {
    query.$text = { $search: search };
  }

  return await Product.find(query)
    .populate('categoryIds', 'name')
    .sort({ createdAt: -1 });
};

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data
 */
const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate('categoryIds', 'name');
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  return product;
};

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated product
 */
const updateProduct = async (id, updateData) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('categoryIds', 'name');

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return product;
};

/**
 * Soft delete a product
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Result of the operation
 */
const deleteProduct = async (id) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!product) {
    throw new NotFoundError('Product not found or already deleted');
  }

  return { message: 'Product deleted successfully' };
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
