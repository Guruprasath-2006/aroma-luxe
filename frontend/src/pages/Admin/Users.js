import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiTrash2, FiUsers, FiArrowLeft, FiX, FiMail, FiPhone, FiMapPin, FiShoppingBag, FiDollarSign, FiCalendar, FiEye } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('/api/users', config);
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      // Fetch user details (now includes orderCount and totalSpent from backend)
      const userResponse = await axios.get(`/api/users/${userId}`, config);
      
      // Fetch user's orders
      const ordersResponse = await axios.get(`/api/orders?user=${userId}`, config);
      const userOrders = ordersResponse.data.orders || [];
      
      // Calculate statistics from orders
      const orderCount = userOrders.length;
      const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      setUserDetails({
        ...userResponse.data.user,
        orders: userOrders,
        orderCount,
        totalSpent
      });
      setLoadingDetails(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
      setLoadingDetails(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    fetchUserDetails(user._id);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`/api/users/${userId}`, config);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? 'bg-primary-500 text-black' 
      : 'bg-blue-500 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-luxury-lightGray/50 hover:bg-luxury-lightGray text-white rounded-lg transition-all duration-300 group"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiArrowLeft className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
          </motion.div>
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Manage Users
          </h1>
          <p className="text-gray-400">{users.length} registered users</p>
        </motion.div>

        {users.length === 0 ? (
          <div className="luxury-card p-12 rounded-xl text-center">
            <FiUsers className="text-primary-500 text-6xl mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No users found</p>
          </div>
        ) : (
          <div className="luxury-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-luxury-darkGray">
                  <tr>
                    <th className="px-6 py-4 text-left text-primary-500 font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-primary-500 font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-primary-500 font-semibold">Role</th>
                    <th className="px-6 py-4 text-left text-primary-500 font-semibold">Orders</th>
                    <th className="px-6 py-4 text-left text-primary-500 font-semibold">Total Spent</th>
                    <th className="px-6 py-4 text-left text-primary-500 font-semibold">Joined</th>
                    <th className="px-6 py-4 text-left text-primary-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-primary-600/20 hover:bg-luxury-lightGray/30 cursor-pointer"
                      onClick={() => handleViewUser(user)}
                    >
                      <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <span className="text-primary-400 font-semibold">{user.orderCount || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <span className="text-green-400 font-semibold">₹{(user.totalSpent || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewUser(user)}
                            className="text-primary-400 hover:text-primary-300 p-2"
                            title="View Details"
                          >
                            <FiEye className="text-xl" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(user._id, user.name)}
                            className="text-red-400 hover:text-red-300 p-2"
                            disabled={user.role === 'admin'}
                            title="Delete User"
                          >
                            <FiTrash2 className="text-xl" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <Modal isOpen={true} onClose={closeModal} title={`User Details - ${selectedUser.name}`}>
            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="loader"></div>
              </div>
            ) : userDetails ? (
              <div className="space-y-6">
                {/* User Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Basic Information</h3>
                    <div className="space-y-5 bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl shadow-lg border-2 border-gray-300">
                      <div>
                        <label className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-2 block">Full Name</label>
                        <p className="text-gray-900 font-bold text-2xl">{userDetails.name || 'N/A'}</p>
                      </div>
                      
                      <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                        <FiMail className="text-blue-600 text-2xl mt-1" />
                        <div className="flex-1">
                          <label className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-2 block">Email</label>
                          <p className="text-blue-900 font-bold text-lg break-all">{userDetails.email || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl border-2 border-green-200">
                        <FiPhone className="text-green-600 text-2xl mt-1" />
                        <div className="flex-1">
                          <label className="text-green-800 text-xs font-bold uppercase tracking-wide mb-2 block">Phone Number</label>
                          <p className="text-green-900 font-bold text-lg">{userDetails.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-3 block">Role</label>
                        <span className={`px-5 py-2.5 rounded-full text-base font-extrabold ${userDetails.role === 'admin' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-blue-600 text-white'} shadow-lg inline-block`}>
                          {userDetails.role?.toUpperCase() || 'USER'}
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <FiCalendar className="text-purple-600 text-2xl mt-1" />
                        <div>
                          <label className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-2 block">Member Since</label>
                          <p className="text-gray-900 font-bold text-lg">{new Date(userDetails.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                        </div>
                      </div>
                      
                      {userDetails.lastLogin && (
                        <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                          <label className="text-purple-800 text-xs font-bold uppercase tracking-wide mb-2 block">Last Login</label>
                          <p className="text-purple-900 font-bold text-base">{new Date(userDetails.lastLogin).toLocaleString()}</p>
                        </div>
                      )}
                      
                      {userDetails.emailVerified !== undefined && (
                        <div>
                          <label className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-2 block">Email Verified</label>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${userDetails.emailVerified ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                            {userDetails.emailVerified ? '✓ Verified' : '⚠ Not Verified'}
                          </span>
                        </div>
                      )}
                      
                      {userDetails.avatar && (
                        <div>
                          <label className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-2 block">Profile Picture</label>
                          <img src={userDetails.avatar} alt={userDetails.name} className="w-20 h-20 rounded-full border-4 border-gray-300 shadow-lg" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border-2 border-blue-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Total Orders</span>
                          <FiShoppingBag className="text-blue-600 text-2xl" />
                        </div>
                        <p className="text-5xl font-extrabold text-blue-600">{userDetails.orderCount || 0}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border-2 border-green-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Total Spent</span>
                          <FiDollarSign className="text-green-600 text-2xl" />
                        </div>
                        <p className="text-5xl font-extrabold text-green-600">₹{(userDetails.totalSpent || 0).toFixed(2)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-2xl shadow-lg border-2 border-cyan-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Average Order Value</span>
                        </div>
                        <p className="text-4xl font-extrabold text-cyan-600">
                          ₹{userDetails.orderCount > 0 ? ((userDetails.totalSpent || 0) / userDetails.orderCount).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses Section */}
                {userDetails.addresses && userDetails.addresses.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-purple-600 flex items-center gap-3 mb-5">
                      <FiMapPin className="text-3xl" />
                      Saved Addresses ({userDetails.addresses.length})
                    </h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {userDetails.addresses.map((address, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl border-2 border-purple-300 shadow-lg">
                          {address.isDefault && (
                            <span className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-full font-bold mb-3 inline-block">
                              Default
                            </span>
                          )}
                          <p className="text-gray-900 font-bold text-lg">{address.fullName}</p>
                          <p className="text-gray-700 text-sm font-semibold mt-2">{address.address}</p>
                          <p className="text-gray-700 text-sm font-semibold">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-gray-700 text-sm font-semibold">{address.country}</p>
                          {address.phone && (
                            <p className="text-gray-700 text-sm mt-2 font-semibold">📞 {address.phone}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Orders Section */}
                {userDetails.orders && userDetails.orders.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600 flex items-center gap-3 mb-5">
                      <FiShoppingBag className="text-3xl" />
                      Recent Orders ({userDetails.orders.length})
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {userDetails.orders.slice(0, 10).map((order) => (
                        <div key={order._id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-gray-900 font-bold text-lg">Order #{order._id?.slice(-8).toUpperCase()}</p>
                              <p className="text-gray-600 text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-700 font-extrabold text-2xl">₹{order.totalAmount?.toFixed(2)}</p>
                              <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                                order.status === 'Delivered' ? 'bg-green-600 text-white' :
                                order.status === 'Cancelled' ? 'bg-red-600 text-white' :
                                order.status === 'Processing' ? 'bg-blue-600 text-white' :
                                'bg-yellow-600 text-white'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-700 text-sm font-semibold">
                            <p className="mb-1">{order.products?.length || 0} item(s)</p>
                            {order.products && order.products.slice(0, 2).map((item, idx) => (
                              <p key={idx} className="truncate text-gray-800">• {item.title}</p>
                            ))}
                            {order.products && order.products.length > 2 && (
                              <p className="text-gray-600">• ... and {order.products.length - 2} more</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferences Section */}
                {userDetails.preferences && (
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-600 mb-5">Preferences</h3>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl space-y-3 border-2 border-gray-300 shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-bold text-base">Email Updates</span>
                        <span className={`font-extrabold text-lg ${userDetails.preferences.emailUpdates ? 'text-green-600' : 'text-red-600'}`}>
                          {userDetails.preferences.emailUpdates ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-bold text-base">Notifications</span>
                        <span className={`font-extrabold text-lg ${userDetails.preferences.notificationsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                          {userDetails.preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      {userDetails.preferences.favoriteCategories && userDetails.preferences.favoriteCategories.length > 0 && (
                        <div>
                          <span className="text-gray-700 font-bold text-base">Favorite Categories:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {userDetails.preferences.favoriteCategories.map((cat, idx) => (
                              <span key={idx} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No details available</p>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;


