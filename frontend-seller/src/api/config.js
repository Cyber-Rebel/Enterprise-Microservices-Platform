// API Base URLs for all backend services
export const API_BASE_URLS = {
  AUTH: 'http://localhost:3000/api',
  PRODUCT: 'http://localhost:3001',
  CART: 'http://localhost:3002',
  ORDER: 'http://localhost:3003',
  SELLER_DASHBOARD: 'http://localhost:3005',
};

// Default axios config
export const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};
