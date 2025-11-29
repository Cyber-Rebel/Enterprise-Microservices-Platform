import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../api/orderApi';

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  successMessage: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Async Thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (shippingAddress, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(shippingAddress);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create order'
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrders(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(id);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order'
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(id);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel order'
      );
    }
  }
);

// Order Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrders: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = [action.payload, ...state.orders];
        state.currentOrder = action.payload;
        state.successMessage = 'Order placed successfully!';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        if (action.payload.meta) {
          state.pagination = {
            page: action.payload.meta.page,
            limit: action.payload.meta.limit,
            total: action.payload.meta.total,
          };
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.currentOrder = action.payload;
        state.successMessage = 'Order cancelled successfully!';
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearOrderSuccess, clearCurrentOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
