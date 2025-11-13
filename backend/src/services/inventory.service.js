import Inventory from '../models/inventory.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

/**
 * Create a new inventory record
 * @param {Object} inventoryData - Inventory data
 * @returns {Promise<Object>} Created inventory record
 */
/**
 * Create multiple inventory records, one for each serial number
 * @param {Object} inventoryData - Inventory data including serialNumbers array
 * @returns {Promise<Array>} Array of created inventory records
 */
const createInventory = async (inventoryData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, ...restData } = inventoryData;

    // Check if product exists and is not deleted
    const product = await Product.findOne({
      _id: restData.productId,
      isDeleted: false
    }).session(session);

    if (!product) {
      throw new Error('Product not found or has been deleted');
    }

    // Create inventory records for each item
    const inventoryPromises = items.map(item => {
      const inventory = new Inventory({
        ...restData,
        serialNumber: item.serialNumber,
        price: item.price,
        quantity: item.quantity,
        usedQuantity: 0, // Default to 0 used quantity for new items
        availableQuantity: item.quantity, // Available quantity equals total quantity for new items
        status: 'in_stock', // Default status for new items
        lastRestocked: new Date(),
        isActive: true
      });
      return inventory.save({ session });
    });

    // Execute all inserts in parallel
    const inventoryRecords = await Promise.all(inventoryPromises);
    const productId = typeof inventoryData.productId === 'string'
      ? new mongoose.Types.ObjectId(inventoryData.productId)
      : inventoryData.productId;

    const [totalStock] = await Inventory.aggregate([
      {
        $match: {
          productId: productId,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$productId',
          totalQuantity: { $sum: '$quantity' },
          totalUsed: { $sum: '$usedQuantity' },
          totalAvailable: { $sum: '$availableQuantity' }
        }
      }
    ]).session(session);

    // Update the product's stock information
    await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          totalStock: totalStock?.totalQuantity || 0,
          availableStock: totalStock?.totalAvailable || 0,
          usedStock: totalStock?.totalUsed || 0,
          lastStockUpdate: new Date()
        }
      },
      { session, new: true }
    );

    await session.commitTransaction();
    await session.endSession();

    return inventoryRecords;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating inventory:', error);
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
      .populate({
        path: 'productId',
        select: 'name',
        match: { isDeleted: { $ne: true } }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Inventory.countDocuments()
      .populate({
        path: 'productId',
        match: { isDeleted: { $ne: true } }
      })
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
