import api from './api';
import { ApiResponse, Brand } from '../types';

export const brandService = {
  // Get all brands
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await api.get('/brands');
    const payload = response.data;
    // Normalize both paginated and plain-array responses
    if (Array.isArray(payload)) {
      return { success: true, data: payload };
    }
    if (payload?.data && Array.isArray(payload.data)) {
      return { success: true, data: payload.data, pagination: {
        currentPage: payload.page,
        totalPages: payload.totalPages,
        total: payload.total,
        limit: payload.limit,
        hasNextPage: payload.page < payload.totalPages,
        hasPrevPage: payload.page > 1,
      } } as any;
    }
    // If backend wraps as { success, data }
    if (payload?.success && Array.isArray(payload.data)) {
      return payload;
    }
    return { success: false, data: [] } as ApiResponse<Brand[]>;
  },

  // Get brand by ID
  async getBrand(id: string): Promise<ApiResponse<Brand>> {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  // Create new brand
  async createBrand(brandData: Partial<Brand>): Promise<ApiResponse<Brand>> {
    const response = await api.post('/brands', brandData);
    return response.data;
  },

  // Update brand
  async updateBrand(id: string, brandData: Partial<Brand>): Promise<ApiResponse<Brand>> {
    const response = await api.put(`/brands/${id}`, brandData);
    return response.data;
  },

  // Delete brand
  async deleteBrand(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },

  // Get brand statistics
  async getBrandStats(): Promise<ApiResponse<{ totalBrands: number; activeBrands: number; countries: string[] }>> {
    const response = await api.get('/brands/stats');
    return response.data;
  },
}; 