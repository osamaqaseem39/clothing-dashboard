import api from './api';
import { ApiResponse } from '../types';

export interface Banner {
  _id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  altText?: string;
  linkUrl?: string;
  linkText?: string;
  displayOrder: number;
  enabled: boolean;
  position: 'hero' | 'collection' | 'promotional' | 'sidebar';
  startDate?: string;
  endDate?: string;
  requiredSize: {
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerDto {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  altText?: string;
  linkUrl?: string;
  linkText?: string;
  displayOrder?: number;
  enabled?: boolean;
  position?: 'hero' | 'collection' | 'promotional' | 'sidebar';
  startDate?: string;
  endDate?: string;
  requiredSize: {
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
}

export const bannerService = {
  async getAll(page = 1, limit = 10, filters?: any): Promise<ApiResponse<Banner[]>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.position && { position: filters.position }),
        ...(filters?.enabled !== undefined && { enabled: filters.enabled.toString() }),
      });

      const response = await api.get(`/banners?${params.toString()}`);
      const payload = response.data;

      if (payload && payload.data) {
        return payload as ApiResponse<Banner[]>;
      }

      return {
        success: true,
        data: (Array.isArray(payload) ? payload : []) as Banner[],
        message: 'Banners loaded successfully',
      };
    } catch (error: any) {
      console.error('Error loading banners:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.message || 'Failed to load banners',
      };
    }
  },

  async getById(id: string): Promise<ApiResponse<Banner>> {
    try {
      const response = await api.get(`/banners/${id}`);
      const payload = response.data;

      if (payload && payload.data) {
        return payload as ApiResponse<Banner>;
      }

      return {
        success: true,
        data: payload as Banner,
        message: 'Banner loaded successfully',
      };
    } catch (error: any) {
      console.error('Error loading banner:', error);
      return {
        success: false,
        data: {} as Banner,
        message: error.response?.data?.message || error.message || 'Failed to load banner',
      };
    }
  },

  async getActiveByPosition(position: string): Promise<ApiResponse<Banner[]>> {
    try {
      const response = await api.get(`/banners/position/${position}`);
      const payload = response.data;

      return {
        success: true,
        data: Array.isArray(payload) ? payload : [],
        message: 'Banners loaded successfully',
      };
    } catch (error: any) {
      console.error('Error loading banners:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.message || 'Failed to load banners',
      };
    }
  },

  async create(data: CreateBannerDto): Promise<ApiResponse<Banner>> {
    try {
      const response = await api.post('/banners', data);
      const payload = response.data;

      if (payload && payload.data) {
        return payload as ApiResponse<Banner>;
      }

      return {
        success: true,
        data: payload as Banner,
        message: 'Banner created successfully',
      };
    } catch (error: any) {
      console.error('Error creating banner:', error);
      return {
        success: false,
        data: {} as Banner,
        message: error.response?.data?.message || error.message || 'Failed to create banner',
      };
    }
  },

  async update(id: string, data: Partial<CreateBannerDto>): Promise<ApiResponse<Banner>> {
    try {
      const response = await api.patch(`/banners/${id}`, data);
      const payload = response.data;

      if (payload && payload.data) {
        return payload as ApiResponse<Banner>;
      }

      return {
        success: true,
        data: payload as Banner,
        message: 'Banner updated successfully',
      };
    } catch (error: any) {
      console.error('Error updating banner:', error);
      return {
        success: false,
        data: {} as Banner,
        message: error.response?.data?.message || error.message || 'Failed to update banner',
      };
    }
  },

  async toggleStatus(id: string, enabled: boolean): Promise<ApiResponse<Banner>> {
    try {
      const response = await api.patch(`/banners/${id}/status`, { enabled });
      const payload = response.data;

      if (payload && payload.data) {
        return payload as ApiResponse<Banner>;
      }

      return {
        success: true,
        data: payload as Banner,
        message: 'Banner status updated successfully',
      };
    } catch (error: any) {
      console.error('Error toggling banner status:', error);
      return {
        success: false,
        data: {} as Banner,
        message: error.response?.data?.message || error.message || 'Failed to toggle banner status',
      };
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/banners/${id}`);
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete banner');
    }
  },
};

