import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sellerAPI } from '../../api/sellerApi';

const initialState = {
  metrics: {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  },
  orders: [],
  recentOrders: [],
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerAPI.getMetrics();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch metrics'
      );
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'dashboard/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerAPI.getOrders();
      return response.orders || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Metrics
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        const { products, orders, users } = action.payload;
        
        // Calculate metrics
        state.metrics.totalProducts = products?.length || 0;
        state.metrics.totalOrders = orders?.length || 0;
        state.metrics.totalUsers = users?.length || 0;
        
        // Calculate total revenue from orders
        let revenue = 0;
        if (orders && orders.length > 0) {
          orders.forEach((order) => {
            if (order.items) {
              order.items.forEach((item) => {
                revenue += (item.price?.amount || 0) * (item.quantity || 1);
              });
            }
          });
        }
        state.metrics.totalRevenue = revenue;
        
        // Store recent orders
        state.recentOrders = orders?.slice(0, 5) || [];
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Seller Orders
      .addCase(fetchSellerOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
