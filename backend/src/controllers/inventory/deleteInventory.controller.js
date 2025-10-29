import { deleteInventory as deleteInventoryService } from '../../services/inventory.service.js';

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

export default deleteInventory;
