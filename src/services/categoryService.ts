import api from './api';
import { ApiResponse, Category } from '../types';

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await api.get('/categories');
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
    return response.data;
  },

  // Update category
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
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