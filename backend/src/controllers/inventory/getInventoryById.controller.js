import { getInventoryById as getInventoryByIdService } from '../../services/inventory.service.js';

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

export default getInventoryById;
