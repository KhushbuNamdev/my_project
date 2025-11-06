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

  // First get all products with basic info
  const products = await Product.find(query)
    .populate('categoryIds', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Get product IDs for inventory lookup
  const productIds = products.map(p => p._id);

  // Get inventory summary for all products in one query
  const inventorySummary = await Product.aggregate([
    { $match: { _id: { $in: productIds } } },
    {
      $lookup: {
        from: 'inventories',
        localField: '_id',
        foreignField: 'productId',
        as: 'inventoryItems',
        pipeline: [
          { $match: { isActive: { $ne: false } } }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        totalQuantity: { $sum: '$inventoryItems.quantity' },
        totalUsed: { $sum: '$inventoryItems.usedQuantity' },
        available: {
          $sum: {
            $map: {
              input: '$inventoryItems',
              as: 'item',
              in: { $subtract: ['$$item.quantity', '$$item.usedQuantity'] }
            }
          }
        },
        inventoryCount: { $size: '$inventoryItems' }
      }
    }
  ]);

  // Create a map of productId to inventory summary
  const inventoryMap = new Map(
    inventorySummary.map(item => [item._id.toString(), item])
  );

  // Merge inventory data with products
  return products.map(product => ({
    ...product,
    inventory: inventoryMap.get(product._id.toString()) || {
      totalQuantity: 0,
      totalUsed: 0,
      available: 0,
      inventoryCount: 0
    }
  }));
};

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data
 */
const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate('categoryIds', 'name')
    .populate('inventorySummary')
    .lean();

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Get the total quantity from the virtual field
  const inventorySummary = await Product.aggregate([
    { $match: { _id: product._id } },
    {
      $lookup: {
        from: 'inventories',
        localField: '_id',
        foreignField: 'productId',
        as: 'inventoryItems',
        pipeline: [
          { $match: { isActive: { $ne: false } } }
        ]
      }
    },
    {
      $project: {
        totalQuantity: { $sum: '$inventoryItems.quantity' },
        totalUsed: { $sum: '$inventoryItems.usedQuantity' },
        available: {
          $sum: {
            $map: {
              input: '$inventoryItems',
              as: 'item',
              in: { $subtract: ['$$item.quantity', '$$item.usedQuantity'] }
            }
          }
        },
        inventoryCount: { $size: '$inventoryItems' }
      }
    }
  ]);

  // Merge the inventory summary with the product
  const result = {
    ...product,
    inventory: inventorySummary[0] || {
      totalQuantity: 0,
      totalUsed: 0,
      available: 0,
      inventoryCount: 0
    }
  };

  return result;
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
