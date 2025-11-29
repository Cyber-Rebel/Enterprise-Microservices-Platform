import axios from 'axios';
import { API_BASE_URLS } from './config';

// Auth API instance
const authApi = axios.create({
  baseURL: API_BASE_URLS.AUTH,
  withCredentials: true,
});

// Auth API calls
export const authAPI = {
  // Register a new seller
  // Backend expects: { username, email, password, fullName: { firstName, lastName }, role }
  register: async (userData) => {
    const response = await authApi.post('/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      fullName: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      role: 'seller',
    });
    return response.data;
  },

  // Login seller
  // Backend accepts: { username OR email, password }
  login: async (credentials) => {
    const response = await authApi.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user info
  getMe: async () => {
    const response = await authApi.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await authApi.get('/auth/logout');
    return response.data;
  },

  // Get user addresses
  getAddresses: async () => {
    const response = await authApi.get('/auth/users/me/addresses');
    return response.data;
  },

  // Add new address
  addAddress: async (addressData) => {
    const response = await authApi.post('/auth/users/me/addresses', addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await authApi.delete(`/auth/users/me/addresses/${addressId}`);
    return response.data;
  },
};

export default authApi;
