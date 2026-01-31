import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiCpu, FiPlus, FiSettings, FiEye, FiUserCheck, FiFileText, FiMail } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('/api/orders/stats/dashboard', config);
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: FiDollarSign,
      color: 'gold',
      link: '/admin/orders'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'blue',
      link: '/admin/orders'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: FiPackage,
      color: 'yellow',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: FiTrendingUp,
      color: 'green',
      link: '/admin/products'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'purple',
      link: '/admin/users'
    },
    {
      title: 'Design Projects',
      value: stats?.totalDesigns || 0,
      icon: FiCpu,
      color: 'blue',
      link: '/admin/designs'
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Welcome to Aroma Luxe Admin Panel</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="luxury-card p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="text-primary-500 text-3xl" />
                    <span className="text-gray-400 text-sm">{stat.title}</span>
                  </div>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="luxury-card p-8 rounded-xl relative overflow-hidden"
        >
          {/* Animated Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
          
          <div className="relative z-10">
            <motion.h2 
              className="text-3xl font-bold text-white mb-8 flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-primary-500"
              >
                ⚡
              </motion.span>
              Quick Actions
            </motion.h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Add New Product */}
              <Link to="/admin/products/add">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-slate-700 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-slate-800 p-6 rounded-xl text-center shadow-2xl border border-slate-600">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="mb-3"
                    >
                      <FiPlus className="text-4xl mx-auto text-slate-300" />
                    </motion.div>
                    <p className="text-slate-200 font-bold text-sm">Add New Product</p>
                  </div>
                </motion.div>
              </Link>

              {/* Manage Products */}
              <Link to="/admin/products">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-slate-700 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-slate-800 p-6 rounded-xl text-center shadow-2xl border border-slate-600">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-3"
                    >
                      <FiSettings className="text-4xl mx-auto text-slate-300" />
                    </motion.div>
                    <p className="text-slate-200 font-bold text-sm">Manage Products</p>
                  </div>
                </motion.div>
              </Link>

              {/* View Orders */}
              <Link to="/admin/orders">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-slate-700 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-slate-800 p-6 rounded-xl text-center shadow-2xl border border-slate-600">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-3"
                    >
                      <FiEye className="text-4xl mx-auto text-slate-300" />
                    </motion.div>
                    <p className="text-slate-200 font-bold text-sm">View Orders</p>
                  </div>
                </motion.div>
              </Link>

              {/* Manage Users */}
              <Link to="/admin/users">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-slate-700 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-slate-800 p-6 rounded-xl text-center shadow-2xl border border-slate-600">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-3"
                    >
                      <FiUserCheck className="text-4xl mx-auto text-slate-300" />
                    </motion.div>
                    <p className="text-slate-200 font-bold text-sm">Manage Users</p>
                  </div>
                </motion.div>
              </Link>

              {/* Review Designs */}
              <Link to="/admin/designs">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-slate-700 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-slate-800 p-6 rounded-xl text-center shadow-2xl border border-slate-600">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-3"
                    >
                      <FiFileText className="text-4xl mx-auto text-slate-300" />
                    </motion.div>
                    <p className="text-slate-200 font-bold text-sm">Review Designs</p>
                  </div>
                </motion.div>
              </Link>

              {/* Contact Messages */}
              <Link to="/admin/contact-messages">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-slate-700 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-slate-800 p-6 rounded-xl text-center shadow-2xl border border-slate-600">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-3"
                    >
                      <FiMail className="text-4xl mx-auto text-slate-300" />
                    </motion.div>
                    <p className="text-slate-200 font-bold text-sm">Contact Messages</p>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


