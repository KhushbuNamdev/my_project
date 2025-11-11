import api from '../service/axiosService';

const INVENTORY_API_BASE_URL = '/inventory';

export const inventoryApi = {
  // Create new inventory
  createInventory: (inventoryData) => 
    api.post(INVENTORY_API_BASE_URL, inventoryData),

  // Get all inventory with pagination
  getAllInventory: (params = {}) => {
    const { page = 1, limit = 10, sortBy, sortOrder, ...filters } = params;
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...filters
    });
    return api.get(`${INVENTORY_API_BASE_URL}?${queryParams}`);
  },

  // Get single inventory by ID
  getInventoryById: (id) => 
    api.get(`${INVENTORY_API_BASE_URL}/${id}`),

  // Update inventory
  updateInventory: (id, updateData) => 
    api.put(`${INVENTORY_API_BASE_URL}/${id}`, updateData),

  // Delete inventory
  deleteInventory: (id) => 
   api.delete(`${INVENTORY_API_BASE_URL}/${id}`),

  // Update stock (quantity/usedQuantity)
  updateStock: (id, updateData) => 
    api.patch(`${INVENTORY_API_BASE_URL}/${id}/stock`, updateData),

  // Get low stock items
  getLowStockItems: (threshold) => 
    api.get(`${INVENTORY_API_BASE_URL}/low-stock?threshold=${threshold}`)
};

export default inventoryApi;