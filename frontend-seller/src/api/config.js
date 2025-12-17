// API Base URLs for all backend services
export const API_BASE_URLS = {
  AUTH: 'http://localhost:3000',
  PRODUCT: 'http://localhost:3001',
  SELLER_DASHBOARD: 'http://localhost:3004',
};

// Default axios config
export const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};
