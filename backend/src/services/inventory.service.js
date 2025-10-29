import Inventory from '../models/inventory.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

/**
 * Create a new inventory record
 * @param {Object} inventoryData - Inventory data
 * @returns {Promise<Object>} Created inventory record
 */
const createInventory = async (inventoryData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Check if product exists and is not deleted
    const product = await Product.findOne({
      _id: inventoryData.productId,
      isDeleted: false
    }).session(session);

    if (!product) {
      throw new Error('Product not found or has been deleted');
    }

    // Check if inventory already exists for this product
    const existingInventory = await Inventory.findOne({
      productId: inventoryData.productId
    }).session(session);

    if (existingInventory) {
      throw new Error('Inventory already exists for this product');
    }

    // Calculate available quantity
    const availableQuantity = (inventoryData.quantity || 0) - (inventoryData.usedQuantity || 0);
    
    // Determine status based on available quantity
    let status = 'out_of_stock';
    if (availableQuantity > 0) {
      status = availableQuantity <= (inventoryData.lowStockThreshold || 10) ? 'low_stock' : 'in_stock';
    }

    const inventory = new Inventory({
      ...inventoryData,
      availableQuantity,
      status,
      lastRestocked: new Date()
    });

    await inventory.save({ session });
    await session.commitTransaction();
    
    // Populate product details when returning
    const result = await Inventory.findById(inventory._id).populate('productId', 'name');
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get inventory by ID
 * @param {string} id - Inventory ID
 * @returns {Promise<Object>} Inventory record
 */
const getInventoryById = async (id) => {
  return await Inventory.findById(id).populate('productId', 'name');
};

/**
 * Get all inventory records with pagination
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of records per page
 * @param {number} options.page - Page number
 * @param {string} options.sortBy - Field to sort by
 * @param {number} options.sortOrder - Sort order (1 for ascending, -1 for descending)
 * @returns {Promise<Object>} Paginated inventory records
 */
const getAllInventory = async ({
  limit = 10,
  page = 1,
  sortBy = 'createdAt',
  sortOrder = -1
}) => {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder };

  const [inventory, total] = await Promise.all([
    Inventory.find()
      .populate('productId', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Inventory.countDocuments()
  ]);

  return {
    data: inventory,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update inventory by ID
 * @param {string} id - Inventory ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated inventory record
 */
const updateInventory = async (id, updateData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const inventory = await Inventory.findById(id).session(session);
    if (!inventory) {
      throw new Error('Inventory not found');
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key in inventory) {
        inventory[key] = updateData[key];
      }
    });

    // Recalculate available quantity if quantity or usedQuantity is updated
    if ('quantity' in updateData || 'usedQuantity' in updateData) {
      inventory.availableQuantity = inventory.quantity - inventory.usedQuantity;
      
      // Update status based on available quantity
      if (inventory.availableQuantity <= 0) {
        inventory.status = 'out_of_stock';
      } else if (inventory.availableQuantity <= inventory.lowStockThreshold) {
        inventory.status = 'low_stock';
      } else {
        inventory.status = 'in_stock';
      }
    }

    // Update last restocked date if quantity is increased
    if ('quantity' in updateData && updateData.quantity > inventory.quantity) {
      inventory.lastRestocked = new Date();
    }

    await inventory.save({ session });
    await session.commitTransaction();
    
    // Populate product details when returning
    const result = await Inventory.findById(inventory._id).populate('productId', 'name');
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Delete inventory by ID
 * @param {string} id - Inventory ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
const deleteInventory = async (id) => {
  const result = await Inventory.findByIdAndDelete(id);
  return !!result;
};

export {
  createInventory,
  getInventoryById,
  getAllInventory,
  updateInventory,
  deleteInventory
};
