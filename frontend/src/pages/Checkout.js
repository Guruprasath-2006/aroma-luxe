


import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiPhone, FiCheck } from 'react-icons/fi';
import { SiGooglepay, SiPhonepe, SiPaytm, SiAmazonpay } from 'react-icons/si';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    phone: '',
    paymentMethod: 'Cash on Delivery'
  });

  const [errors, setErrors] = useState({});

  // Validation functions
  const validateFullName = (name) => {
    const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/;
    if (!name.trim()) return 'Full name is required';
    if (!nameRegex.test(name)) return 'Full name should only contain letters, spaces, and common punctuation';
    if (name.trim().length < 2) return 'Full name must be at least 2 characters';
    return '';
  };

  const validateAddress = (address) => {
    if (!address.trim()) return 'Address is required';
    if (address.trim().length < 10) return 'Address must be at least 10 characters';
    if (address.trim().length > 200) return 'Address must be less than 200 characters';
    return '';
  };

  const validateCity = (city) => {
    const cityRegex = /^[a-zA-Z\s.'-]{2,50}$/;
    if (!city.trim()) return 'City is required';
    if (!cityRegex.test(city)) return 'City should only contain letters and spaces';
    return '';
  };

  const validatePostalCode = (code) => {
    // Supports various formats: 123456, 12345, 12345-6789, A1A 1A1, etc.
    const postalRegex = /^[A-Za-z0-9\s-]{3,10}$/;
    if (!code.trim()) return 'Postal code is required';
    if (!postalRegex.test(code)) return 'Please enter a valid postal code';
    return '';
  };

  const validateCountry = (country) => {
    // Always set to India
    return '';
  };

  const validatePhone = (phone) => {
    // Remove spaces, dashes, and parentheses for validation
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^[+]?[\d]{10,15}$/;
    
    if (!phone.trim()) return 'Phone number is required';
    if (!phoneRegex.test(cleanPhone)) return 'Please enter a valid phone number (10-15 digits)';
    if (cleanPhone.length < 10) return 'Phone number must be at least 10 digits';
    return '';
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'city':
        error = validateCity(value);
        break;
      case 'postalCode':
        error = validatePostalCode(value);
        break;
      case 'country':
        error = validateCountry(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (orderData) => {
    try {
      console.log('Starting payment process...');
      
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again or use Cash on Delivery.');
        setLoading(false);
        return;
      }

      console.log('Creating order on backend...');
      
      // Create order on backend
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const { data } = await axios.post('/api/orders/create-razorpay-order', {
        amount: orderData.totalAmount
      }, config);

      console.log('Order created:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Check if demo mode (Razorpay not configured) OR if user wants to proceed anyway
      if (data.isDemo) {
        console.log('⚠️ Demo mode detected - creating order directly');
        
        // Ask user if they want to proceed with demo payment
        const proceedWithDemo = window.confirm(
          '⚠️ Payment Gateway Demo Mode\n\n' +
          'The payment gateway is not fully configured. ' +
          'Your order will be created with "Pending Payment" status.\n\n' +
          'Would you like to proceed?'
        );

        if (!proceedWithDemo) {
          setLoading(false);
          toast.info('Order cancelled. Please try Cash on Delivery option.');
          return;
        }
        
        // Create order directly without Razorpay modal
        const demoOrderData = {
          ...orderData,
          paymentStatus: 'pending',
          paymentId: data.razorpayOrderId || `demo_${Date.now()}`
        };

        const orderResponse = await axios.post('/api/orders', demoOrderData, config);
        
        if (orderResponse.data.success) {
          toast.success('Order placed successfully! Payment is pending.');
          clearCart();
          navigate('/orders');
        } else {
          throw new Error('Failed to create order');
        }
        setLoading(false);
        return;
      }

      // Real Razorpay payment
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Velan Engineering',
        description: 'Engineering Services Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          console.log('Payment successful:', response);
          try {
            setLoading(true);
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                ...orderData,
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'paid'
              }
            };

            const verifyResponse = await axios.post('/api/orders/verify-payment', verifyData, config);
            
            if (verifyResponse.data.success) {
              toast.success('Payment successful! Order placed.');
              clearCart();
              navigate('/orders');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: '',
          contact: formData.phone
        },
        notes: {
          address: formData.address
        },
        theme: {
          color: '#ff6f00'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      console.log('Opening Razorpay modal...');
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Razorpay payment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user has phone number registered
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('/api/auth/profile', config);
      
      if (!data.user.phone) {
        toast.error('Please add a phone number to your profile before placing orders. Go to Profile > Edit Profile to add your phone number.');
        setTimeout(() => navigate('/profile'), 2000);
        return;
      }
    } catch (error) {
      console.error('Error checking user phone:', error);
    }
    
    // Validate all fields
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      address: validateAddress(formData.address),
      city: validateCity(formData.city),
      postalCode: validatePostalCode(formData.postalCode),
      phone: validatePhone(formData.phone)
    };

    setErrors(newErrors);

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      toast.error('Please correct the errors in the form');
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors).find(key => newErrors[key] !== '');
      document.getElementsByName(firstErrorField)[0]?.focus();
      return;
    }

    // Additional validation
    if (!formData.fullName || !formData.address || !formData.city || 
        !formData.postalCode || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        products: cart.map(item => ({
          product: item._id,
          title: item.title,
          brand: item.brand,
          price: item.price,
          size: item.size,
          quantity: item.quantity || 1,
          image: item.images[0]
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: getCartTotal() * 1.1 // Including 10% tax
      };

      console.log('Order Data:', orderData);
      console.log('Payment Method:', formData.paymentMethod);

      // Process Cash on Delivery order
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post('/api/orders', orderData, config);
      
      console.log('Order Response:', response.data);

      if (response.data.success) {
        setShowSuccessModal(true);
        clearCart();
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/orders');
        }, 4000);
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Checkout
          </h1>
          <p className="text-gray-400">Complete your order</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="luxury-card p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      pattern="[A-Za-z\s.'-]{2,50}"
                      title="Full name should only contain letters, spaces, and common punctuation"
                      className={`w-full px-4 py-3 bg-luxury-black text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gold-600/30 focus:ring-gold-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      minLength="10"
                      maxLength="200"
                      className={`w-full px-4 py-3 bg-luxury-black text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gold-600/30 focus:ring-gold-500'
                      }`}
                      placeholder="Street address, building, apartment number"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-400">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        pattern="[A-Za-z\s.'-]{2,50}"
                        title="City should only contain letters and spaces"
                        className={`w-full px-4 py-3 bg-luxury-black text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gold-600/30 focus:ring-gold-500'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        pattern="[A-Za-z0-9\s-]{3,10}"
                        title="Please enter a valid postal code"
                        className={`w-full px-4 py-3 bg-luxury-black text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.postalCode ? 'border-red-500 focus:ring-red-500' : 'border-gold-600/30 focus:ring-gold-500'
                        }`}
                        placeholder="Postal code"
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-400">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Country</label>
                    <div className="w-full px-4 py-3 bg-luxury-lightGray/30 text-white border border-gold-600/30 rounded-lg flex items-center justify-between">
                      <span className="text-white font-medium">🇮🇳 India</span>
                      <span className="text-xs text-gray-400">(Fixed)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      pattern="[+]?[\d\s\-()]{10,15}"
                      title="Please enter a valid phone number (10-15 digits)"
                      className={`w-full px-4 py-3 bg-luxury-black text-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gold-600/30 focus:ring-gold-500'
                      }`}
                      placeholder="Phone number (e.g., +91 1234567890)"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-3 text-lg font-semibold">Payment Method *</label>
                    
                    <div className="space-y-4">
                      {/* Cash on Delivery Only */}
                      <div className="space-y-2">
                        
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'Cash on Delivery' 
                            ? 'border-primary-500 bg-primary-500/10' 
                            : 'border-gold-600/30 hover:border-primary-500/50'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Cash on Delivery"
                            checked={formData.paymentMethod === 'Cash on Delivery'}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-500"
                          />
                          <FiDollarSign className="text-3xl text-green-500" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">Cash on Delivery</p>
                            <p className="text-xs text-gray-400">Pay with cash when your order is delivered</p>
                          </div>
                        </label>
                        
                        {/* Professional Agent Callback Notice */}
                        <div className="mt-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                          <p className="text-sm text-gray-300">
                            <span className="text-primary-400 font-semibold">📞 Order Confirmation:</span> Our customer service agent will call you within a few minutes to confirm your order details and delivery schedule.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="luxury-card p-6 rounded-xl sticky top-24"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{item.title}</p>
                        <p className="text-gray-400 text-xs">{item.brand}</p>
                        <p className="text-gold-500 text-sm">
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gold-600/20 pt-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (10%)</span>
                    <span>₹{(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gold-600/20 pt-3">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span className="text-gold-500">₹{(getCartTotal() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 gold-glow-btn text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring", 
                damping: 15, 
                stiffness: 150,
                duration: 0.6 
              }}
              className="luxury-card rounded-3xl max-w-lg w-full overflow-hidden"
            >
              {/* Success Icon with Animation */}
              <div className="bg-gradient-to-br from-green-500/20 to-primary-500/20 p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2,
                    type: "spring",
                    damping: 10,
                    stiffness: 100
                  }}
                  className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4"
                >
                  <FiCheck className="text-white text-5xl font-bold" strokeWidth={3} />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Order Placed Successfully! 🎉
                </motion.h2>
              </div>

              {/* Agent Call Message */}
              <div className="p-8 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-primary-500/10 border-2 border-primary-500/30 rounded-2xl p-6 mb-4"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      delay: 0.8,
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="inline-block"
                  >
                    <FiPhone className="text-primary-500 text-6xl mb-4" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-primary-400 mb-3">
                    Our Agent Will Call You
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    One of our customer service representatives will contact you within a few minutes to confirm your order details and discuss the delivery schedule.
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-gray-400 text-sm"
                >
                  Please keep your phone nearby
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 text-primary-500 text-sm"
                >
                  Redirecting to your orders...
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
