import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
