import api from './api';
import { ApiResponse } from '../types';

export interface DeliveryCharge {
  _id?: string;
  locationName: string;
  locationType: 'country' | 'state' | 'city' | 'postal_code';
  country: string;
  state?: string;
  city?: string;
  postalCode?: string;
  baseCharge: number;
  chargePerKg?: number;
  chargePerItem?: number;
  freeShippingThreshold?: number;
  minimumOrderAmount?: number;
  maximumOrderAmount?: number;
  enabled: boolean;
  priority: number;
  estimatedDeliveryDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDeliveryChargeDto {
  locationName: string;
  locationType: 'country' | 'state' | 'city' | 'postal_code';
  country: string;
  state?: string;
  city?: string;
  postalCode?: string;
  baseCharge: number;
  chargePerKg?: number;
  chargePerItem?: number;
  freeShippingThreshold?: number;
  minimumOrderAmount?: number;
  maximumOrderAmount?: number;
  enabled?: boolean;
  priority?: number;
  estimatedDeliveryDays?: number;
}

export const deliveryChargeService = {
  async getAll(): Promise<ApiResponse<DeliveryCharge[]>> {
    try {
      const response = await api.get('/shipping/delivery-charges');
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
        return payload as ApiResponse<DeliveryCharge[]>;
      }

      // Backend returned array directly, wrap it
      return {
        success: true,
        data: (Array.isArray(payload) ? payload : []) as DeliveryCharge[],
      };
    } catch (error: any) {
      console.error('Error loading delivery charges:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.message || 'Failed to load delivery charges',
      };
    }
  },

  async getById(id: string): Promise<ApiResponse<DeliveryCharge>> {
    try {
      const response = await api.get(`/shipping/delivery-charges/${id}`);
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
        return payload as ApiResponse<DeliveryCharge>;
      }

      // Backend returned object directly, wrap it
      return {
        success: true,
        data: payload as DeliveryCharge,
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as DeliveryCharge,
        message: error.response?.data?.message || error.message || 'Failed to load delivery charge',
      };
    }
  },

  async create(data: CreateDeliveryChargeDto): Promise<ApiResponse<DeliveryCharge>> {
    try {
      const response = await api.post('/shipping/delivery-charges', data);
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
        return payload as ApiResponse<DeliveryCharge>;
      }

      // Backend returned object directly, wrap it
      return {
        success: true,
        data: payload as DeliveryCharge,
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as DeliveryCharge,
        message: error.response?.data?.message || error.message || 'Failed to create delivery charge',
      };
    }
  },

  async update(id: string, data: Partial<CreateDeliveryChargeDto>): Promise<ApiResponse<DeliveryCharge>> {
    try {
      const response = await api.patch(`/shipping/delivery-charges/${id}`, data);
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
        return payload as ApiResponse<DeliveryCharge>;
      }

      // Backend returned object directly, wrap it
      return {
        success: true,
        data: payload as DeliveryCharge,
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as DeliveryCharge,
        message: error.response?.data?.message || error.message || 'Failed to update delivery charge',
      };
    }
  },

  async toggleStatus(id: string, enabled: boolean): Promise<ApiResponse<DeliveryCharge>> {
    try {
      const response = await api.patch(`/shipping/delivery-charges/${id}/status`, { enabled });
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
        return payload as ApiResponse<DeliveryCharge>;
      }

      // Backend returned object directly, wrap it
      return {
        success: true,
        data: payload as DeliveryCharge,
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as DeliveryCharge,
        message: error.response?.data?.message || error.message || 'Failed to toggle delivery charge status',
      };
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/shipping/delivery-charges/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete delivery charge');
    }
  },
};

