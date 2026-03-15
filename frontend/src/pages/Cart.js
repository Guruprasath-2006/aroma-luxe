import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600 rounded-full filter blur-3xl"
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FiShoppingCart className="text-primary-500 text-6xl mx-auto mb-6" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold font-serif text-white mb-4"
          >
            Your Cart is Empty
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 mb-8"
          >
            Start shopping to add items to your cart
          </motion.p>
          <Link to="/shop">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-black font-bold rounded-lg shadow-lg shadow-primary-500/30"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-primary-500 rounded-full filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-64 h-64 bg-primary-600 rounded-full filter blur-3xl"
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold font-serif bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent mb-2"
          >
            Shopping Cart
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            <motion.span
              key={getCartCount()}
              initial={{ scale: 1.3, color: "#FFD700" }}
              animate={{ scale: 1, color: "#9CA3AF" }}
              className="font-bold text-primary-500"
            >
              {getCartCount()}
            </motion.span> {getCartCount() === 1 ? 'item' : 'items'} in your cart
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 30, scale: 0.95, transition: { duration: 0.3 } }}
                  transition={{ 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(212, 175, 55, 0.2)" }}
                  className="luxury-card p-6 rounded-xl group relative overflow-hidden"
                >
                  {/* Hover Glow Effect - Non-Interactive */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-transparent group-hover:to-primary-500/5 transition-all duration-500 pointer-events-none"
                  />
                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                  {/* Product Image - Clickable */}
                  <Link to={`/product/${item._id}`} className="block relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative overflow-hidden rounded-lg"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full sm:w-32 h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-primary-500 text-sm font-semibold">{item.brand}</p>
                        <Link to={`/product/${item._id}`} className="block">
                          <motion.h3 
                            whileHover={{ x: 5, color: "#D4AF37" }}
                            className="text-xl font-bold text-white transition-colors cursor-pointer"
                          >
                            {item.title}
                          </motion.h3>
                        </Link>
                        <p className="text-gray-400 text-sm">{item.size}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <FiTrash2 className="text-xl" />
                      </motion.button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.15, backgroundColor: "#D4AF37" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 bg-luxury-black border-2 border-primary-600/50 rounded-lg flex items-center justify-center text-white hover:text-black transition-all shadow-lg"
                        >
                          <FiMinus />
                        </motion.button>
                        <motion.span 
                          key={item.quantity}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          className="text-white font-bold w-8 text-center text-lg"
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.button
                          whileHover={{ scale: 1.15, backgroundColor: "#D4AF37" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 bg-luxury-black border-2 border-primary-600/50 rounded-lg flex items-center justify-center text-white hover:text-black transition-all shadow-lg"
                        >
                          <FiPlus />
                        </motion.button>
                      </div>
                      <div className="text-right">
                        <motion.p 
                          key={item.price * item.quantity}
                          initial={{ scale: 1.2, color: "#FFD700" }}
                          animate={{ scale: 1, color: "#D4AF37" }}
                          className="text-2xl font-bold text-primary-500"
                        >
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </motion.p>
                        <p className="text-gray-400 text-sm">₹{item.price} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="lg:col-span-1"
          >
            <motion.div 
              whileHover={{ boxShadow: "0 25px 50px rgba(212, 175, 55, 0.2)" }}
              className="luxury-card p-6 rounded-xl sticky top-24 bg-gradient-to-br from-luxury-darkGray to-luxury-black relative overflow-hidden"
            >
              {/* Animated Border Glow */}
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border-2 border-primary-500/30 rounded-xl pointer-events-none"
              />
              
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-6 relative z-10"
              >
                Order Summary
              </motion.h2>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 mb-6 relative z-10"
              >
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal (Estimated)</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-400">TBD</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (Estimated)</span>
                  <span>₹{(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-primary-600/20 pt-4">
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Estimated Total</span>
                    <motion.span 
                      key={getCartTotal()}
                      initial={{ scale: 1.3, color: "#FFD700" }}
                      animate={{ scale: 1, color: "#D4AF37" }}
                      className="text-primary-500"
                    >
                      ₹{(getCartTotal() * 1.1).toFixed(2)}
                    </motion.span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">*Final cost will be determined after project completion</p>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(212, 175, 55, 0.6)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-black font-bold rounded-lg mb-4 relative overflow-hidden group shadow-lg shadow-primary-500/30 z-10"
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                  style={{ opacity: 0.2 }}
                />
                <span className="relative z-10">Proceed to Checkout</span>
              </motion.button>

              <Link to="/shop">
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:text-primary-400 transition-all z-10 relative"
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


