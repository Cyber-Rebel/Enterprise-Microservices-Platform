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
  register: async (userData) => {
    const response = await authApi.post('/api/auth/register', {
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
  login: async (credentials) => {
    const response = await authApi.post('/api/auth/login', credentials);
    return response.data;
  },

  // Get current user info
  getMe: async () => {
    const response = await authApi.get('/api/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await authApi.get('/api/auth/logout');
    return response.data;
  },
};

export default authApi;
