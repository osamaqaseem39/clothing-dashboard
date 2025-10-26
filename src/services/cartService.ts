import api from './api';
import { ApiResponse, Cart, CartItem } from '../types';

export interface AddToCartRequest {
  productId: string;
  variationId?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export const cartService = {
  // Create a new cart
  async createCart(customerId?: string): Promise<ApiResponse<Cart>> {
    const response = await api.post('/cart', { customerId });
    return response.data;
  },

  // Get cart by session ID (for guest users)
  async getCartBySession(sessionId: string): Promise<ApiResponse<Cart>> {
    const response = await api.get(`/cart/session/${sessionId}`);
    return response.data;
  },

  // Get cart by customer ID (for logged-in users)
  async getCartByCustomer(customerId: string): Promise<ApiResponse<Cart>> {
    const response = await api.get(`/cart/customer/${customerId}`);
    return response.data;
  },

  // Add item to cart
  async addItemToCart(cartId: string, item: AddToCartRequest): Promise<ApiResponse<Cart>> {
    const response = await api.post(`/cart/${cartId}/items`, item);
    return response.data;
  },

  // Update cart item quantity
  async updateCartItem(cartId: string, productId: string, update: UpdateCartItemRequest): Promise<ApiResponse<Cart>> {
    const response = await api.patch(`/cart/${cartId}/items/${productId}`, update);
    return response.data;
  },

  // Remove item from cart
  async removeCartItem(cartId: string, productId: string): Promise<ApiResponse<Cart>> {
    const response = await api.delete(`/cart/${cartId}/items/${productId}`);
    return response.data;
  },

  // Clear all items from cart
  async clearCart(cartId: string): Promise<ApiResponse<Cart>> {
    const response = await api.delete(`/cart/${cartId}/items`);
    return response.data;
  },

  // Assign cart to customer (when guest logs in)
  async assignCartToCustomer(sessionId: string, customerId: string): Promise<ApiResponse<Cart>> {
    const response = await api.post(`/cart/${sessionId}/assign-customer`, { customerId });
    return response.data;
  },

  // Merge guest cart with customer cart
  async mergeGuestCartWithCustomerCart(sessionId: string, customerId: string): Promise<ApiResponse<Cart>> {
    const response = await api.post(`/cart/merge/${sessionId}/${customerId}`);
    return response.data;
  },

  // Get cart summary
  async getCartSummary(cartId: string): Promise<ApiResponse<CartSummary>> {
    const response = await api.get(`/cart/${cartId}/summary`);
    return response.data;
  },

  // Calculate cart total
  async calculateCartTotal(cartId: string): Promise<ApiResponse<{ total: number }>> {
    const response = await api.post(`/cart/${cartId}/calculate-total`);
    return response.data;
  },

  // Delete cart
  async deleteCart(cartId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/cart/${cartId}`);
    return response.data;
  },
};
