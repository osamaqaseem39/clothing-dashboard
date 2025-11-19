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
    const response = await api.get<ApiResponse<DeliveryCharge[]>>('/shipping/delivery-charges');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<DeliveryCharge>> {
    const response = await api.get<ApiResponse<DeliveryCharge>>(`/shipping/delivery-charges/${id}`);
    return response.data;
  },

  async create(data: CreateDeliveryChargeDto): Promise<ApiResponse<DeliveryCharge>> {
    const response = await api.post<ApiResponse<DeliveryCharge>>('/shipping/delivery-charges', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateDeliveryChargeDto>): Promise<ApiResponse<DeliveryCharge>> {
    const response = await api.patch<ApiResponse<DeliveryCharge>>(`/shipping/delivery-charges/${id}`, data);
    return response.data;
  },

  async toggleStatus(id: string, enabled: boolean): Promise<ApiResponse<DeliveryCharge>> {
    const response = await api.patch<ApiResponse<DeliveryCharge>>(`/shipping/delivery-charges/${id}/status`, { enabled });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/shipping/delivery-charges/${id}`);
  },
};

