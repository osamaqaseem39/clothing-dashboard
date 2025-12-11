import api from './api';
import { ApiResponse, Inventory } from '../types';

// Helper to extract productId from string or populated object
function extractProductId(productId: any): string {
  if (!productId) return '';
  if (typeof productId === 'string') return productId;
  if (typeof productId === 'object' && productId._id) return productId._id.toString();
  if (typeof productId === 'object' && productId.toString) return productId.toString();
  return String(productId);
}

// Normalize inventory item to ensure productId is always a string
function normalizeInventoryItem(item: any): Inventory {
  if (!item) return item;
  return {
    ...item,
    productId: extractProductId(item.productId),
  };
}

function normalizeInventoryResponse(payload: any): ApiResponse<Inventory[] | any> {
  // Already normalized shape
  if (payload && typeof payload === 'object' && 'success' in payload) {
    // Normalize items in the response
    if (payload.data && Array.isArray(payload.data)) {
      payload.data = payload.data.map(normalizeInventoryItem);
    }
    return payload;
  }
  // Array response
  if (Array.isArray(payload)) {
    return { success: true, data: payload.map(normalizeInventoryItem) } as ApiResponse<Inventory[]>;
  }
  // Common paginated shape { data: [], total, page, limit, totalPages }
  if (payload && Array.isArray(payload.data)) {
    return { 
      success: true, 
      data: payload.data.map(normalizeInventoryItem),
      ...(payload.total !== undefined && { total: payload.total }),
      ...(payload.page !== undefined && { page: payload.page }),
      ...(payload.limit !== undefined && { limit: payload.limit }),
      ...(payload.totalPages !== undefined && { totalPages: payload.totalPages }),
    } as ApiResponse<Inventory[]>;
  }
  // Direct object
  return { success: true, data: [] as Inventory[] };
}

export const inventoryService = {
  // Get all inventory items
  async getInventory(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory');
    return normalizeInventoryResponse(response.data) as ApiResponse<Inventory[]>;
  },

  // Get inventory by product ID
  async getInventoryByProduct(productId: string): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get(`/inventory/product/${productId}`);
    return normalizeInventoryResponse(response.data) as ApiResponse<Inventory[]>;
  },

  // Get low stock items
  async getLowStock(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory/low-stock');
    return normalizeInventoryResponse(response.data) as ApiResponse<Inventory[]>;
  },

  // Get out of stock items
  async getOutOfStock(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory/out-of-stock');
    return normalizeInventoryResponse(response.data) as ApiResponse<Inventory[]>;
  },

  // Get inventory statistics
  async getInventoryStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/inventory/stats');
    return response.data;
  },

  // Create inventory record
  async createInventory(inventoryData: Partial<Inventory>): Promise<ApiResponse<Inventory>> {
    const response = await api.post('/inventory', inventoryData);
    return response.data;
  },

  // Update inventory
  async updateInventory(id: string, inventoryData: Partial<Inventory>): Promise<ApiResponse<Inventory>> {
    const response = await api.patch(`/inventory/${id}`, inventoryData);
    return response.data;
  },

  // Adjust stock
  async adjustStock(id: string, adjustmentData: any): Promise<ApiResponse<Inventory>> {
    const response = await api.post(`/inventory/${id}/adjust`, adjustmentData);
    return response.data;
  },

  // Transfer stock
  async transferStock(id: string, transferData: any): Promise<ApiResponse<any>> {
    const response = await api.post(`/inventory/${id}/transfer`, transferData);
    return response.data;
  },

  // Get inventory movements
  async getInventoryMovements(id: string): Promise<ApiResponse<any[]>> {
    const response = await api.get(`/inventory/${id}/movements`);
    return response.data;
  },

  // Delete inventory record
  async deleteInventory(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};
