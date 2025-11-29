import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../store/slices/orderSlice';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, isLoading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id, isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusStep = (status) => {
    const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    return steps.indexOf(status?.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const result = await dispatch(cancelOrder(id));
      if (!result.error) {
        dispatch(fetchOrderById(id));
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Please login to view order details</h2>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order not found</h2>
          <p className="text-gray-500 mb-6">{error || 'The order you\'re looking for doesn\'t exist'}</p>
          <Link
            to="/orders"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const order = currentOrder;
  const statusStep = getStatusStep(order.status);
  const isCancelled = order.status?.toUpperCase() === 'CANCELLED';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{order._id?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`px-4 py-2 text-sm font-medium rounded-lg border ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-6">Order Progress</h2>
            <div className="relative">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200"></div>
              <div
                className="absolute top-5 left-5 h-0.5 bg-indigo-600 transition-all"
                style={{ width: `${(statusStep / 3) * 100}%` }}
              ></div>
              <div className="relative flex justify-between">
                {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= statusStep
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index < statusStep ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`mt-2 text-xs ${index <= statusStep ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.productId?.images?.[0] ? (
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {item.productId?.title || 'Product'}
                  </h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    ₹{((item.productId?.price?.amount || 0) * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.productId?.price?.amount || 0} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p className="font-medium text-gray-800">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-2 text-gray-500">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{(order.totalPrice?.amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>₹{(order.totalPrice?.amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {order.status?.toUpperCase() === 'PENDING' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Need to cancel?</h3>
                <p className="text-sm text-gray-500">You can cancel this order before it's confirmed</p>
              </div>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
