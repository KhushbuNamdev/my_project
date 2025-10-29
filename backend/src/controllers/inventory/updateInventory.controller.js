import { updateInventory as updateInventoryService } from '../../services/inventory.service.js';
import { updateInventorySchema } from '../../validations/inventory.validation.js';

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

export default updateInventory;
