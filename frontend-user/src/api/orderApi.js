import axios from 'axios';
import { API_BASE_URLS } from './config';

// Order API instance
const orderApi = axios.create({
  baseURL: API_BASE_URLS.ORDER,
  withCredentials: true,
});

// Order API calls
export const orderAPI = {
  // Create new order from cart
  createOrder: async (shippingAddress) => {
    const response = await orderApi.post('/orders', {
      shippingAddress,
    });
    return response.data;
  },

  // Get all user orders
  getOrders: async (page = 1, limit = 10) => {
    const response = await orderApi.get(`/orders/me?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single order by ID
  getOrderById: async (id) => {
    const response = await orderApi.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await orderApi.post(`/orders/${id}/cancel`);
    return response.data;
  },

  // Update order address
  updateOrderAddress: async (id, address) => {
    const response = await orderApi.patch(`/orders/${id}/address`, address);
    return response.data;
  },
};

export default orderApi;
