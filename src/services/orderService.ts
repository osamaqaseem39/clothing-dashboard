import api from './api';
import { ApiResponse, Order } from '../types';

export interface CreateOrderRequest {
  customerId: string;
  paymentMethod: string;
  paymentStatus?: string;
  total: number;
  subtotal: number;
  discountTotal?: number;
  shippingTotal?: number;
  taxTotal?: number;
  currency?: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
  items: Array<{
    productId: string;
    variationId?: string;
    name: string;
    sku?: string;
    quantity: number;
    price: number;
    subtotal: number;
    total: number;
  }>;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const orderService = {
  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get all orders with filters
  async getOrders(filters?: OrderFilters, page: number = 1, limit: number = 20): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.minAmount) params.append('minAmount', filters.minAmount.toString());
    if (filters?.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  // Get single order by ID
  async getOrder(id: string): Promise<ApiResponse<{ order: Order }>> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Get orders by customer ID
  async getCustomerOrders(customerId: string): Promise<ApiResponse<Order[]>> {
    const response = await api.get(`/orders/customer/${customerId}`);
    return response.data;
  },

  // Update order status
  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<{ order: Order }>> {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Get order statistics
  async getOrderStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};