import { getAllInventory as getAllInventoryService } from '../../services/inventory.service.js';

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

export default getAllInventory;
