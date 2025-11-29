import axios from 'axios';
import { API_BASE_URLS } from './config';

// Product API instance
const productApi = axios.create({
  baseURL: API_BASE_URLS.PRODUCT,
  withCredentials: true,
});

// Product API calls
export const productAPI = {
  // Get all products with optional filters
  getProducts: async (params = {}) => {
    const { q, minprice, maxprice, skip = 0, limit = 20 } = params;
    const queryParams = new URLSearchParams();
    
    if (q) queryParams.append('q', q);
    if (minprice) queryParams.append('miniprice', minprice);
    if (maxprice) queryParams.append('maxprice', maxprice);
    queryParams.append('skip', skip);
    queryParams.append('limit', limit);
    
    const response = await productApi.get(`/products?${queryParams.toString()}`);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await productApi.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await productApi.get(`/products?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export default productApi;
