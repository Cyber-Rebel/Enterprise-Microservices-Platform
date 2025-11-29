import axios from 'axios';
import { API_BASE_URLS } from './config';

// Cart API instance
const cartApi = axios.create({
  baseURL: API_BASE_URLS.CART,
  withCredentials: true,
});

// Cart API calls
export const cartAPI = {
  // Get user's cart
  // GET /api/carts
  getCart: async () => {
    const response = await cartApi.get('/carts');
    return response.data;
  },

  // Add item to cart
  // POST /api/carts/items - body: { productId, quantity }
  addToCart: async (productId, quantity = 1) => {
    const response = await cartApi.post('/carts/items', {
      productId,
      quantity,
    });
    return response.data;
  },

  // Update item quantity
  // PATCH /api/carts/items/:productId - body: { qty }
  updateQuantity: async (productId, qty) => {
    const response = await cartApi.patch(`/carts/items/${productId}`, {
      qty,
    });
    return response.data;
  },

  // Remove item from cart (set quantity to 0)
  removeFromCart: async (productId) => {
    const response = await cartApi.patch(`/carts/items/${productId}`, {
      qty: 0,
    });
    return response.data;
  },
};

export default cartApi;
