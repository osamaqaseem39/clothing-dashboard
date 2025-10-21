import api from './api';
import { ApiResponse, Inventory } from '../types';

export const inventoryService = {
  // Get all inventory items
  async getInventory(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory');
    return response.data;
  },

  // Get inventory by product ID
  async getInventoryByProduct(productId: string): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get(`/inventory/product/${productId}`);
    return response.data;
  },

  // Get low stock items
  async getLowStock(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },

  // Get out of stock items
  async getOutOfStock(): Promise<ApiResponse<Inventory[]>> {
    const response = await api.get('/inventory/out-of-stock');
    return response.data;
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
