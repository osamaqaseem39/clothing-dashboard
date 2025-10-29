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
    const response = await api.get(`/master-data/${this.endpoint}`);
    return response.data;
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const response = await api.get(`/master-data/${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
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
    } else {
      // Backend returned the item directly, wrap it
      return {
        success: true,
        data: payload as T,
      };
    }
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
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
  }

  async delete(id: string): Promise<ApiResponse<void>> {
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
