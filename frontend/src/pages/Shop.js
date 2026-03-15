import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiStar, FiShoppingCart, FiX, FiZap } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategory, priceRange]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products?limit=100');
      setProducts(data.products);
      setFilteredProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };



  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-luxury-black relative overflow-hidden">
      {/* Global Background Animations Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated Grid Pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Large Morphing Shapes */}
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)'
          }}
          animate={{
            x: [0, 200, -100, 0],
            y: [0, -150, 100, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)'
          }}
          animate={{
            x: [0, -200, 150, 0],
            y: [0, 100, -100, 0],
            scale: [1, 0.9, 1.3, 1]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Floating Particles System */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100 - Math.random() * 200, 0],
              x: [0, (Math.random() - 0.5) * 100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1 + Math.random(), 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut'
            }}
          />
        ))}
        
        {/* Light Beams */}
        <motion.div
          className="absolute top-0 left-1/4 w-1 h-full origin-top"
          style={{
            background: 'linear-gradient(to bottom, rgba(212,175,55,0.1), transparent)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scaleX: [1, 1.5, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          className="absolute top-0 right-1/3 w-1 h-full origin-top"
          style={{
            background: 'linear-gradient(to bottom, rgba(212,175,55,0.08), transparent)'
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scaleX: [1, 2, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        
        {/* Geometric Shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`geo-${i}`}
            className="absolute border border-primary-500/10"
            style={{
              width: 50 + Math.random() * 100,
              height: 50 + Math.random() * 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: i % 2 === 0 ? '50%' : '0%'
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.5
            }}
          />
        ))}
        
        {/* Gradient Waves */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.05) 0%, transparent 50%)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 70% 60%, rgba(212,175,55,0.04) 0%, transparent 50%)'
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </div>
      
      {/* Animated Header with Gradient */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-luxury-darkGray via-luxury-darkGray to-primary-900/20 border-b border-primary-600/30 relative overflow-hidden z-10"
      >
        {/* Enhanced Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          {/* Pulsing Orbs */}
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-600 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
          />
          
          {/* Rotating Rings */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border-2 border-primary-500/20 rounded-full"
            style={{ marginLeft: '-300px', marginTop: '-300px' }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border-2 border-primary-600/15 rounded-full"
            style={{ marginLeft: '-200px', marginTop: '-200px' }}
            animate={{
              rotate: -360,
              scale: [1, 1.15, 1]
            }}
            transition={{
              rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
              scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            }}
          />
          
          {/* Floating Stars/Sparkles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-primary-500 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-3 bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent"
          >
            Engineering Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-300 text-center text-lg"
          >
            Professional solutions for your engineering needs
          </motion.p>
        </div>
      </motion.div>

      {/* Animated Horizontal Filters Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-luxury-darkGray/80 border-b border-primary-600/30 sticky top-0 z-40 backdrop-blur-md shadow-lg shadow-primary-500/10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {/* Search with Animation */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative w-full sm:w-80"
            >
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-luxury-black text-white rounded-lg border border-primary-600/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 text-sm transition-all duration-300"
              />
              <motion.div
                animate={{ rotate: searchTerm ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </motion.div>
            </motion.div>

            {/* Category with Hover */}
            <motion.select
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all duration-300 cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Industrial">Industrial Engineering</option>
              <option value="Consulting">Engineering Consulting</option>
              <option value="Maintenance">Maintenance Services</option>
            </motion.select>

            {/* Price Range */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-2"
            >
              <motion.input
                whileFocus={{ scale: 1.05, borderColor: "#D4AF37" }}
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-24 px-3 py-2 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all duration-300"
              />
              <motion.input
                whileFocus={{ scale: 1.05, borderColor: "#D4AF37" }}
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-24 px-3 py-2 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all duration-300"
              />
            </motion.div>

            {/* Clear Filters with Animation */}
            <AnimatePresence>
              {(searchTerm || selectedCategory || priceRange.min || priceRange.max) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="px-4 py-2 text-primary-500 hover:text-primary-400 font-medium text-sm transition-colors duration-200"
                >
                  Clear All
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Products Section - Full Width */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Enhanced Background Animation Layer */}
        <div className="absolute inset-0 opacity-5 pointer-events-none z-0 overflow-hidden">
          {/* Flowing Waves */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(212,175,55,0.1) 0px, transparent 10px, transparent 20px, rgba(212,175,55,0.1) 30px)'
            }}
            animate={{
              x: [0, 100],
              y: [0, -100]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          
          {/* Orbiting Particles */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 150;
            return (
              <motion.div
                key={`orbit-${i}`}
                className="absolute w-2 h-2 bg-primary-500/40 rounded-full"
                style={{
                  left: '50%',
                  top: '50%'
                }}
                animate={{
                  x: [Math.cos(angle) * radius, Math.cos(angle + Math.PI * 2) * radius],
                  y: [Math.sin(angle) * radius, Math.sin(angle + Math.PI * 2) * radius],
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.2
                }}
              />
            );
          })}
          
          {/* Pulsing Circles */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 border-2 border-primary-500/20 rounded-full"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
          
          <motion.div
            className="absolute bottom-20 right-20 w-64 h-64 border-2 border-primary-600/20 rounded-full"
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.4, 0, 0.4]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 1.5
            }}
          />
          
          {/* Moving Gradient Blobs */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 80, 0],
              y: [0, -60, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute top-10 left-10 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl"
          />
          
          <motion.div
            animate={{ 
              scale: [1, 1.4, 1],
              x: [0, -70, 0],
              y: [0, 50, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-primary-600/10 rounded-full filter blur-3xl"
          />
          
          {/* Diamond Shapes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`diamond-${i}`}
              className="absolute border-2 border-primary-500/10"
              style={{
                width: 40,
                height: 40,
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 2) * 60}%`,
                transform: 'rotate(45deg)'
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [45, 135, 45],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5
              }}
            />
          ))}
        </div>
        
        {/* Animated Results Count */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-center relative z-10"
        >
          <p className="text-gray-400 text-sm">
            Showing <motion.span 
              key={filteredProducts.length}
              initial={{ scale: 1.5, color: '#FFD700' }}
              animate={{ scale: 1, color: '#D4AF37' }}
              className="text-primary-500 font-bold text-lg"
            >
              {filteredProducts.length}
            </motion.span> of {products.length} services
          </p>
        </motion.div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center h-96 relative"
          >
            {/* Animated Loading Spinner */}
            <motion.div
              className="relative w-32 h-32"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="absolute inset-0 border-4 border-primary-500/30 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 border-t-4 border-primary-500 rounded-full"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-primary-500 font-semibold mt-6 text-lg"
            >
              Loading Services...
            </motion.p>
            {/* Floating particles */}
            <motion.div
              animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute top-20 left-1/3 w-2 h-2 bg-primary-500 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute top-32 right-1/3 w-2 h-2 bg-primary-600 rounded-full"
            />
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-center py-20 relative"
          >
            {/* Animated Empty State Icon */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-6"
            >
              <svg 
                className="w-24 h-24 mx-auto text-primary-500/30"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-xl mb-4"
            >
              No services found matching your criteria
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-sm mb-6"
            >
              Try adjusting your filters or search terms
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={resetFilters}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-black font-semibold rounded-lg shadow-lg shadow-primary-500/30"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Animated Gap Effects Layer */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {/* Connecting Lines between Products */}
              {filteredProducts.length > 1 && (
                <>
                  {/* Horizontal Lines */}
                  {[...Array(Math.ceil(filteredProducts.length / 4))].map((_, rowIndex) => (
                    <motion.div
                      key={`h-line-${rowIndex}`}
                      className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent"
                      style={{
                        top: `${rowIndex * 25 + 50}%`,
                        left: '5%',
                        right: '5%'
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: rowIndex * 0.2, duration: 1 }}
                    />
                  ))}
                  
                  {/* Vertical Lines */}
                  {[...Array(4)].map((_, colIndex) => (
                    <motion.div
                      key={`v-line-${colIndex}`}
                      className="absolute w-[1px] bg-gradient-to-b from-transparent via-primary-500/15 to-transparent"
                      style={{
                        left: `${colIndex * 25 + 12.5}%`,
                        top: '10%',
                        bottom: '10%'
                      }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + colIndex * 0.1, duration: 1 }}
                    />
                  ))}
                  
                  {/* Grid Intersection Nodes */}
                  {[...Array(Math.min(filteredProducts.length, 12))].map((_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    return (
                      <motion.div
                        key={`node-${i}`}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          left: `${col * 25 + 12.5}%`,
                          top: `${row * 33 + 16.5}%`,
                          background: 'radial-gradient(circle, rgba(212,175,55,0.6), transparent)'
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.15
                        }}
                      />
                    );
                  })}
                  
                  {/* Flowing Particles in Gaps */}
                  {[...Array(20)].map((_, i) => {
                    const path = i % 2 === 0 ? 'horizontal' : 'vertical';
                    const lane = Math.floor(i / 2) % 4;
                    return (
                      <motion.div
                        key={`gap-particle-${i}`}
                        className="absolute w-1 h-1 bg-primary-500/40 rounded-full"
                        style={{
                          [path === 'horizontal' ? 'top' : 'left']: `${lane * 25 + 12.5}%`,
                          [path === 'horizontal' ? 'left' : 'top']: '0%'
                        }}
                        animate={{
                          [path === 'horizontal' ? 'x' : 'y']: ['0%', '100%'],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0]
                        }}
                        transition={{
                          duration: 4 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: 'linear'
                        }}
                      />
                    );
                  })}
                  
                  {/* Energy Pulses in Gaps */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`pulse-${i}`}
                      className="absolute w-16 h-16 border-2 border-primary-500/20 rounded-full"
                      style={{
                        left: `${(i % 4) * 25 + 10}%`,
                        top: `${Math.floor(i / 4) * 50 + 20}%`
                      }}
                      animate={{
                        scale: [0.5, 2, 0.5],
                        opacity: [0.5, 0, 0.5],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeOut'
                      }}
                    />
                  ))}
                  
                  {/* Diagonal Energy Beams */}
                  <motion.div
                    className="absolute w-full h-[1px] origin-left"
                    style={{
                      top: '25%',
                      background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)',
                      transform: 'rotate(15deg)'
                    }}
                    animate={{
                      scaleX: [0, 1, 0],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                  
                  <motion.div
                    className="absolute w-full h-[1px] origin-right"
                    style={{
                      top: '65%',
                      background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)',
                      transform: 'rotate(-15deg)'
                    }}
                    animate={{
                      scaleX: [0, 1, 0],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      delay: 1.5
                    }}
                  />
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ 
                  delay: index * 0.08, 
                  type: 'spring', 
                  stiffness: 80,
                  damping: 15
                }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.04,
                  rotateY: 2,
                  transition: { duration: 0.3 }
                }}
                className="luxury-card rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-500 relative cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: 1000
                }}
              >
                {/* Animated Corner Accent */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.2 }}
                  className="absolute top-0 left-0 w-20 h-20 pointer-events-none z-10"
                >
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary-500/50"
                  />
                </motion.div>
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-luxury-darkGray to-luxury-black">
                  <Link to={`/product/${product._id}`}>
                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.08 + 0.1, duration: 0.6 }}
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: [0, 1, -1, 0],
                          transition: { duration: 0.8, ease: 'easeOut' }
                        }}
                      />
                    </motion.div>
                  </Link>
                  {/* Animated Price Badge */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30, rotate: 10 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ 
                      delay: index * 0.08 + 0.4,
                      type: 'spring',
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: -8,
                      boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)'
                    }}
                    className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-primary-400/50 backdrop-blur-sm"
                  >
                    <span className="block text-xs opacity-90 relative z-10">ESTIMATION COST</span>
                    <motion.span 
                      className="block text-base relative z-10"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ₹{product.price}
                    </motion.span>
                  </motion.div>
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <div className="p-5 relative z-20">
                  {/* Animated Brand Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + 0.3, type: 'spring' }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="inline-block mb-2"
                  >
                    <motion.p 
                      className="text-primary-500 text-sm font-semibold uppercase tracking-wider px-2 py-1 bg-primary-500/10 rounded-md border border-primary-500/20 backdrop-blur-sm relative overflow-hidden"
                    >
                      {/* Background pulse */}
                      <motion.div
                        className="absolute inset-0 bg-primary-500/20"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="relative z-10">{product.brand}</span>
                    </motion.p>
                  </motion.div>
                  <Link to={`/product/${product._id}`}>
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 + 0.4 }}
                      whileHover={{ 
                        x: 5,
                        color: '#D4AF37',
                        textShadow: '0 0 8px rgba(212, 175, 55, 0.5)'
                      }}
                      className="text-base font-bold text-white mb-3 transition-colors line-clamp-2 h-12 cursor-pointer"
                    >
                      {product.title}
                    </motion.h3>
                  </Link>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.08 + 0.5 }}
                    className="flex items-center justify-between mb-4"
                  >
                    <motion.div 
                      className="flex items-center space-x-2 bg-luxury-black/50 px-3 py-1 rounded-full border border-primary-500/20"
                      whileHover={{ 
                        scale: 1.1,
                        borderColor: 'rgba(212, 175, 55, 0.5)',
                        boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'
                      }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                          scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                        }}
                      >
                        <FiStar className="text-primary-500 fill-current text-sm" />
                      </motion.div>
                      <motion.span 
                        className="text-white text-sm font-semibold"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {product.rating}
                      </motion.span>
                    </motion.div>
                    <motion.span 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 + 0.6 }}
                      className="text-gray-400 text-sm px-2 py-1 bg-luxury-black/30 rounded-md"
                    >
                      {product.size}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 + 0.7 }}
                    className="space-y-2"
                  >
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: '0 0 25px rgba(212, 175, 55, 0.6)',
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 text-black font-bold text-sm rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/30 relative overflow-hidden group/btn"
                    >
                      {/* Ripple Effect Container */}
                      <motion.div
                        className="absolute inset-0 bg-white/30"
                        initial={{ scale: 0, opacity: 1 }}
                        whileTap={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <FiShoppingCart size={16} className="relative z-10" />
                      </motion.div>
                      <span className="relative z-10">Add to Cart</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleBuyNow(product)}
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        borderColor: '#D4AF37',
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 border-2 border-primary-600/50 text-primary-500 font-semibold text-sm rounded-lg transition-all relative overflow-hidden group/buy"
                    >
                      {/* Animated Border Pulse */}
                      <motion.div
                        className="absolute inset-0 border-2 border-primary-500/50 rounded-lg"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.span 
                        className="relative z-10 flex items-center justify-center space-x-2"
                        whileHover={{ letterSpacing: '0.05em' }}
                      >
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                          <FiZap size={14} />
                        </motion.span>
                        <span>Consulting</span>
                      </motion.span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal with Enhanced Animations */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Animated Background Particles */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-500/30 rounded-full"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0
                  }}
                  animate={{
                    y: [null, Math.random() * window.innerHeight],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: -15, y: 50 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 15, y: 50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-luxury-darkGray via-luxury-darkGray to-luxury-black rounded-xl max-w-2xl w-full overflow-hidden shadow-xl border border-primary-500/20 relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative">
                <motion.button
                  onClick={() => setQuickViewProduct(null)}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 90,
                    backgroundColor: '#D4AF37'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm hover:bg-primary-500 text-white hover:text-black p-2 rounded-full transition-all z-10 border-2 border-primary-500/30"
                >
                  <FiX className="text-xl" />
                </motion.button>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.img
                      src={quickViewProduct.images[0]}
                      alt={quickViewProduct.title}
                      className="w-full h-80 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  </motion.div>
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="p-6 relative z-10"
                  >
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-primary-500 text-sm font-semibold mb-2 uppercase tracking-wider px-3 py-1 bg-primary-500/10 rounded-md border border-primary-500/20 inline-block"
                    >
                      {quickViewProduct.brand}
                    </motion.p>
                    <motion.h3 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl font-bold text-white mb-2"
                    >
                      {quickViewProduct.title}
                    </motion.h3>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring' }}
                      className="flex items-center space-x-2 mb-4 bg-luxury-black/50 px-3 py-2 rounded-lg border border-primary-500/20 inline-flex"
                    >
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ 
                          rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                          scale: { duration: 1, repeat: Infinity }
                        }}
                      >
                        <FiStar className="text-primary-500 fill-current" />
                      </motion.div>
                      <span className="text-white font-semibold">{quickViewProduct.rating}</span>
                      <span className="text-gray-400">• {quickViewProduct.size}</span>
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-gray-300 mb-6 line-clamp-3"
                    >
                      {quickViewProduct.description}
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: 'spring' }}
                      className="text-3xl font-bold text-primary-500 mb-6 relative inline-block"
                    >
                      <motion.div
                        className="absolute inset-0 bg-primary-500/20 blur-xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="relative z-10">ESTIMATION COST-₹{quickViewProduct.price}</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-3"
                    >
                      <motion.button
                        onClick={() => {
                          handleBuyNow(quickViewProduct);
                          setQuickViewProduct(null);
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          boxShadow: '0 0 30px rgba(212, 175, 55, 0.7)',
                          y: -3
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 text-black font-semibold rounded-lg flex items-center justify-center space-x-2 relative overflow-hidden group shadow-lg"
                      >
                        <motion.div
                          whileHover={{ rotate: [0, 360] }}
                          transition={{ duration: 0.5 }}
                        >
                          <FiZap className="relative z-10" />
                        </motion.div>
                        <span className="relative z-10">Consulting</span>
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          handleAddToCart(quickViewProduct);
                          setQuickViewProduct(null);
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          borderColor: '#D4AF37',
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          y: -3
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 border-2 border-primary-500 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-primary-500/10"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <motion.div
                          whileHover={{ rotate: [0, -15, 15, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <FiShoppingCart className="relative z-10" />
                        </motion.div>
                        <span className="relative z-10">Add to Cart</span>
                      </motion.button>
                      <Link to={`/product/${quickViewProduct._id}`} onClick={() => setQuickViewProduct(null)}>
                        <motion.button 
                          whileHover={{ 
                            scale: 1.05,
                            backgroundColor: 'rgba(100, 100, 100, 0.3)',
                            y: -3
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 border-2 border-gray-600 text-gray-300 font-semibold rounded-lg hover:text-white transition-all relative overflow-hidden"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gray-600/20"
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ duration: 0.4 }}
                          />
                          <span className="relative z-10">View Full Details</span>
                        </motion.button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;


