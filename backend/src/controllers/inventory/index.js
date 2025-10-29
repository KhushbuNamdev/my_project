import createInventory from './createInventory.controller.js';
import getInventoryById from './getInventoryById.controller.js';
import getAllInventory from './getAllInventory.controller.js';
import updateInventory from './updateInventory.controller.js';
import deleteInventory from './deleteInventory.controller.js';

export {
  createInventory,
  getInventoryById,
  getAllInventory,
  updateInventory,
  deleteInventory
};

// This file serves as a central export point for all inventory controllers.
// Importing from this file allows for cleaner imports in route files.
// Example: import { createInventory, getInventoryById } from '../controllers/inventory';
