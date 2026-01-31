import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPackage, FiCalendar, FiDollarSign, FiMapPin, FiClock } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('/api/orders/myorders', config);
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'Processing':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'Shipped':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'Delivered':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'Cancelled':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-teal-400 text-xl font-bold animate-pulse">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full p-8 mb-6 inline-block border-2 border-teal-400/50 shadow-2xl shadow-teal-500/30">
            <FiPackage className="text-teal-400 text-7xl" />
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            No Orders Yet
          </h2>
          <p className="text-slate-300 text-xl mb-8 drop-shadow">Start shopping to place your first order and explore our collection</p>
          <button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:from-teal-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-teal-500/50">
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl">
            My Orders
          </h1>
          <p className="text-slate-300 text-xl font-medium drop-shadow">Track and manage your orders with ease</p>
        </motion.div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-white/90 text-base font-bold mb-2 flex items-center">
                      <FiPackage className="mr-2 text-xl" /> Order ID
                    </p>
                    <p className="text-white font-mono text-lg bg-white/20 px-4 py-2 rounded-lg inline-block font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-left">
                      <p className="text-white/90 text-base mb-2 flex items-center font-bold">
                        <FiCalendar className="mr-2 text-xl" /> Order Date
                      </p>
                      <p className="text-white text-base font-bold bg-white/20 px-3 py-1 rounded-lg">
                        {new Date(order.orderDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-white/90 text-base mb-2 flex items-center font-bold">
                        <FiClock className="mr-2 text-xl" /> Status
                      </p>
                      <span className={`px-5 py-2 rounded-full text-sm font-extrabold ${getStatusColor(order.status)} shadow-lg uppercase`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 space-y-4 bg-slate-50">
                {order.products.map((item) => (
                  <div key={item._id} className="flex gap-4 bg-white p-5 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300 shadow-sm">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-28 h-28 object-cover rounded-xl border-2 border-slate-200 shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-teal-600 text-sm font-extrabold uppercase tracking-wider mb-2">{item.brand}</p>
                      <h3 className="text-slate-900 font-bold text-xl mb-3">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-slate-700 text-base font-semibold">
                          <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full mr-2 font-bold border border-slate-300">
                            Size: {item.size}
                          </span>
                          <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-bold border border-teal-300">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <p className="text-teal-700 font-extrabold text-2xl">₹{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="bg-slate-50 p-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div className="flex-1">
                    <p className="text-slate-700 text-base font-extrabold mb-3 flex items-center">
                      <FiMapPin className="mr-2 text-xl text-teal-600" /> Shipping Address
                    </p>
                    <p className="text-slate-600 text-base leading-relaxed bg-white px-5 py-3 rounded-lg font-semibold border border-slate-200 shadow-sm">
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                    </p>
                  </div>
                  <div className="text-right bg-gradient-to-br from-teal-50 to-cyan-50 px-6 py-4 rounded-xl border-2 border-teal-200 shadow-md">
                    <p className="text-slate-700 text-base mb-2 flex items-center justify-end font-extrabold">
                      <FiDollarSign className="mr-1 text-xl text-teal-600" /> Total Amount
                    </p>
                    <p className="text-5xl font-extrabold text-teal-700">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;


