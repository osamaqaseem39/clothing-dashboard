import api from './api';
import { Attribute } from '../types';

export interface MasterDataItem {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Color extends MasterDataItem {
  hexCode?: string;
  imageUrl?: string;
}

export interface Size extends MasterDataItem {
  sizeType?: 'numeric' | 'alphabetic' | 'custom';
  unit?: 'cm' | 'inch' | 'US' | 'UK' | 'EU' | 'none';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Generic master data service
class MasterDataService<T extends MasterDataItem> {
  constructor(private endpoint: string) {}

  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      const response = await api.get(`/master-data/${this.endpoint}`);
      const payload = response.data;

      // Normalize response: backend may return array directly or wrapped in { success, data }
      if (
        payload &&
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        'success' in payload &&
        'data' in payload &&
        typeof (payload as any).success === 'boolean'
      ) {
        return payload as ApiResponse<T[]>;
      }

      return {
        success: true,
        data: (Array.isArray(payload) ? payload : []) as T[],
      };
    } catch (error: any) {
      // Handle 404 - endpoint doesn't exist, return empty array
      if (error.response?.status === 404) {
        return {
          success: true,
          data: [] as T[],
        };
      }
      // For other errors, return error response
      return {
        success: false,
        data: [] as T[],
        message: error.response?.data?.message || error.message || 'Failed to load data',
      };
    }
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(`/master-data/${this.endpoint}/${id}`);
      const payload = response.data;

      // Normalize response: backend may return object directly or wrapped in { success, data }
      if (
        payload &&
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        'success' in payload &&
        'data' in payload &&
        typeof (payload as any).success === 'boolean'
      ) {
        return payload as ApiResponse<T>;
      }

      return {
        success: true,
        data: payload as T,
      };
    } catch (error: any) {
      // Handle 404 - item doesn't exist
      if (error.response?.status === 404) {
        return {
          success: false,
          data: {} as T,
          message: 'Item not found',
        };
      }
      // For other errors, return error response
      return {
        success: false,
        data: {} as T,
        message: error.response?.data?.message || error.message || 'Failed to load item',
      };
    }
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(`/master-data/${this.endpoint}`, data);
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
        return payload as ApiResponse<T>;
      } else if (payload && typeof payload === 'object' && !Array.isArray(payload) && payload._id) {
        // Backend returned the item directly, wrap it
        return {
          success: true,
          data: payload as T,
        };
      } else {
        // Unexpected response format
        console.error(`Unexpected response format from /master-data/${this.endpoint}:`, payload);
        return {
          success: false,
          data: {} as T,
          message: 'Unexpected response format from server',
        };
      }
    } catch (error: any) {
      console.error(`Error creating ${this.endpoint}:`, error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Failed to create item';
      return {
        success: false,
        data: {} as T,
        message: errorMessage,
      };
    }
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(`/master-data/${this.endpoint}/${id}`, data);
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
        return payload as ApiResponse<T>;
      } else {
        // Backend returned the item directly, wrap it
        return {
          success: true,
          data: payload as T,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        data: {} as T,
        message: error.response?.data?.message || error.message || 'Failed to update item',
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/master-data/${this.endpoint}/${id}`);
      const payload = response.data;
      
      // Normalize response: backend may return success object or empty response
      if (
        payload &&
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        'success' in payload &&
        typeof payload.success === 'boolean'
      ) {
        return payload as ApiResponse<void>;
      } else {
        // Backend returned empty or different format, wrap it
        return {
          success: true,
          data: undefined,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || error.message || 'Failed to delete item',
      };
    }
  }
}

// Specific services for each master data type
export const materialService = new MasterDataService<MasterDataItem>('materials');
export const occasionService = new MasterDataService<MasterDataItem>('occasions');
export const seasonService = new MasterDataService<MasterDataItem>('seasons');
export const colorService = new MasterDataService<Color>('colors');
export const patternService = new MasterDataService<MasterDataItem>('patterns');
export const sleeveLengthService = new MasterDataService<MasterDataItem>('sleeve-lengths');
export const necklineService = new MasterDataService<MasterDataItem>('necklines');
export const lengthService = new MasterDataService<MasterDataItem>('lengths');
export const fitService = new MasterDataService<MasterDataItem>('fits');
export const ageGroupService = new MasterDataService<MasterDataItem>('age-groups');
export const colorFamilyService = new MasterDataService<MasterDataItem>('color-families');
export const careInstructionService = new MasterDataService<MasterDataItem>('care-instructions');
export const attributeService = new MasterDataService<Attribute>('attributes');
export const featureService = new MasterDataService<MasterDataItem>('features');
export const tagService = new MasterDataService<MasterDataItem>('tags');
export const sizeService = new MasterDataService<Size>('sizes');
