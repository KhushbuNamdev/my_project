import { createInventory as createInventoryService } from '../../services/inventory.service.js';
import { createInventorySchema } from '../../validations/inventory.validation.js';

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

    const createdRecords = await createInventoryService(req.body);

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdRecords.length} inventory records`,
      data: createdRecords
    });
  } catch (error) {
    next(error);
  }
};

export default createInventory;
