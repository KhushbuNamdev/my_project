import { createInventory as createInventoryService, getInventoryById as getInventoryByIdService, getAllInventory as getAllInventoryService, updateInventory as updateInventoryService, deleteInventory as deleteInventoryService } from '../../services/inventory.service.js';
import { createInventorySchema, updateInventorySchema } from '../../validations/inventory.validation.js';

const createInventory = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = createInventorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const inventory = await createInventoryService(req.body);
    
    res.status(201).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

const getInventoryById = async (req, res, next) => {
  try {
    const inventory = await getInventoryByIdService(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

const getAllInventory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 } = req.query;
    
    const result = await getAllInventoryService({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sortBy,
      sortOrder: parseInt(sortOrder, 10)
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const updateInventory = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = updateInventorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const inventory = await updateInventoryService(req.params.id, req.body);
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

const deleteInventory = async (req, res, next) => {
  try {
    const success = await deleteInventoryService(req.params.id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { _id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

export {
  createInventory,
  getInventoryById,
  getAllInventory,
  updateInventory,
  deleteInventory
};
