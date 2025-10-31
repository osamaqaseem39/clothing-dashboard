import api from './api';
import { ApiResponse, Category } from '../types';

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    // Fetch all categories (not only active) and normalize paginated/array responses
    const params = new URLSearchParams();
    params.append('page', '1');
    params.append('limit', '1000');
    const response = await api.get(`/categories?${params.toString()}`);
    const payload = response.data;
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
    if (payload?.success && Array.isArray(payload.data)) {
      return payload;
    }
    return { success: false, data: [] } as ApiResponse<Category[]>;
  },

  // Get category by ID
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  async createCategory(categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await api.post('/categories', categoryData);
    const payload = response.data;
    
    // Normalize response: backend may return the item directly or wrapped in { success, data }
    if (
      payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      'success' in payload &&
      'data' in payload &&
      typeof payload.success === 'boolean'
    ) {
      // Already in ApiResponse format
      return payload as ApiResponse<Category>;
    } else {
      // Backend returned the item directly, wrap it
      return {
        success: true,
        data: payload as Category,
      };
    }
  },

  // Update category
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await api.put(`/categories/${id}`, categoryData);
    const payload = response.data;
    
    // Normalize response: backend may return the item directly or wrapped in { success, data }
    if (
      payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      'success' in payload &&
      'data' in payload &&
      typeof payload.success === 'boolean'
    ) {
      // Already in ApiResponse format
      return payload as ApiResponse<Category>;
    } else {
      // Backend returned the item directly, wrap it
      return {
        success: true,
        data: payload as Category,
      };
    }
  },

  // Delete category
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
  
  // Get category statistics
  async getCategoryStats(): Promise<ApiResponse<{ totalCategories: number; activeCategories: number }>> {
    const response = await api.get('/categories/stats');
    return response.data;
  },
}; 