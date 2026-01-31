import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaShoppingBag,
  FaDollarSign,
  FaCalendarAlt,
  FaBell,
  FaLock
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    joinedDate: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    notificationsEnabled: true,
    emailUpdates: true
  });

  useEffect(() => {
    if (user) {
      console.log('User data loaded:', user); // Debug log
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setPreferences({
        notificationsEnabled: user.preferences?.notificationsEnabled ?? true,
        emailUpdates: user.preferences?.emailUpdates ?? true
      });
      setStats({
        totalOrders: user.orderCount || 0,
        totalSpent: user.totalSpent || 0,
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferenceChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/api/auth/update-profile',
        { ...formData, preferences },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/api/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Password changed successfully!');
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  {user?.avatar && user.avatar !== 'https://res.cloudinary.com/demo/image/upload/avatar-placeholder.jpg' ? (
                    <img
                      src={user.avatar}
                      alt={user?.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-4 border-purple-100 shadow-lg flex items-center justify-center text-white text-4xl font-bold"
                    style={{ display: (user?.avatar && user.avatar !== 'https://res.cloudinary.com/demo/image/upload/avatar-placeholder.jpg') ? 'none' : 'flex' }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold">
                  {user?.role === 'admin' ? '👑 Admin' : '⭐ Customer'}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaShoppingBag className="text-blue-600 text-xl" />
                    <span className="text-gray-700">Total Orders</span>
                  </div>
                  <span className="font-bold text-blue-600">{stats.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaDollarSign className="text-green-600 text-xl" />
                    <span className="text-gray-700">Total Spent</span>
                  </div>
                  <span className="font-bold text-green-600">${stats.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                    <span className="text-gray-700">Member Since</span>
                  </div>
                  <span className="font-bold text-purple-600 text-sm">{stats.joinedDate}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaUser className="mr-3 text-purple-600" />
                  Personal Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 text-gray-800 placeholder-purple-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <FaBell className="mr-2 text-purple-600" />
                      Notification Preferences
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="notificationsEnabled"
                          checked={preferences.notificationsEnabled}
                          onChange={handlePreferenceChange}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Enable push notifications</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailUpdates"
                          checked={preferences.emailUpdates}
                          onChange={handlePreferenceChange}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Receive email updates</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <FaSave />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <FaUser className="text-purple-600 text-xl mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Full Name</p>
                      <p className="text-gray-900 font-medium">{user?.name || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FaEnvelope className="text-purple-600 text-xl mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Email</p>
                      <p className="text-gray-900 font-medium">{user?.email || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FaPhone className="text-purple-600 text-xl mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Phone</p>
                      <p className="text-gray-900 font-medium">{user?.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FaBell className="text-purple-600 text-xl mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Notifications</p>
                      <p className="text-gray-900 font-medium">
                        {preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaLock className="mr-3 text-purple-600" />
                  Security Settings
                </h3>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <FaEdit />
                    <span>Change Password</span>
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <FaSave />
                      <span>{loading ? 'Changing...' : 'Change Password'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-gray-600">
                  <p>Keep your account secure by using a strong password.</p>
                  <p className="mt-2 text-sm">Last changed: {stats.joinedDate}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
