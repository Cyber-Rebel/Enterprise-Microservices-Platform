import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMe, logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Please login to view your profile</h2>
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.fullName?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {user?.fullName?.firstName} {user?.fullName?.lastName}
              </h1>
              <p className="text-gray-500">@{user?.username}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'addresses'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'security'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={user?.fullName?.firstName || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user?.fullName?.lastName || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Contact support to update your profile information
                </p>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-4">
                    {user.addresses.map((address, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{address.fullName}</p>
                            <p className="text-gray-600">{address.street}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-gray-600">{address.country}</p>
                            <p className="text-gray-500 mt-1">Phone: {address.phone}</p>
                          </div>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No addresses saved</h3>
                    <p className="text-gray-500">
                      Your shipping addresses will be saved when you place orders
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-1">Password</h3>
                  <p className="text-gray-500 text-sm mb-3">
                    Keep your account secure with a strong password
                  </p>
                  <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    Change Password
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-1">Account Role</h3>
                  <p className="text-gray-500 text-sm">
                    Your account type:{' '}
                    <span className="font-medium text-indigo-600 capitalize">{user?.role || 'User'}</span>
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-medium text-red-800 mb-1">Danger Zone</h3>
                  <p className="text-red-600 text-sm mb-3">
                    Once deleted, your account cannot be recovered
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <svg className="w-8 h-8 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="font-semibold text-gray-800">My Orders</h3>
            <p className="text-sm text-gray-500">View order history</p>
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <svg className="w-8 h-8 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="font-semibold text-gray-800">My Cart</h3>
            <p className="text-sm text-gray-500">View cart items</p>
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <svg className="w-8 h-8 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="font-semibold text-gray-800">Shop Now</h3>
            <p className="text-sm text-gray-500">Browse products</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
