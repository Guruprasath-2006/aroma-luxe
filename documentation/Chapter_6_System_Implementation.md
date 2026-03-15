# CHAPTER 6: SYSTEM IMPLEMENTATION

---

## 6.1 INTRODUCTION

System implementation is the critical phase where the theoretical design is transformed into a working software application. This chapter provides a comprehensive analysis of how the Aroma Luxe e-commerce platform was developed, including the development environment, technology stack, coding standards, and step-by-step implementation of each module.

The implementation was carried out systematically over a period of 12 weeks, following Agile methodology with regular testing and iteration. Each module was developed, tested, and integrated with existing components to ensure seamless functionality.

---

## 6.2 DEVELOPMENT ENVIRONMENT

### 6.2.1 Hardware Configuration

The project was developed using the following hardware specifications:

**Development Machine:**
- **Processor:** Intel Core i5-11th Gen (2.4 GHz)
- **RAM:** 8 GB DDR4
- **Storage:** 512 GB SSD
- **Display:** 15.6" Full HD (1920 x 1080)
- **Graphics:** Integrated Intel UHD Graphics

**Server Requirements (Production):**
- **Cloud Platform:** Render.com (Backend), Vercel (Frontend)
- **Database:** MongoDB Atlas (M0 Free Tier - 512 MB)
- **Bandwidth:** Unlimited
- **Uptime:** 99.9% guaranteed

### 6.2.2 Software Requirements

**Operating System:**
- Windows 11 Pro (Build 22H2)

**Development Tools:**
- **Node.js:** v18.17.0 - JavaScript runtime for backend
- **npm:** v9.8.1 - Package manager
- **MongoDB:** v6.0.5 - NoSQL database
- **MongoDB Compass:** v1.39.3 - Database GUI tool
- **Visual Studio Code:** v1.82.0 - Code editor
- **Git:** v2.42.0 - Version control system
- **Postman:** v10.18 - API testing tool
- **Google Chrome:** v117.0 - Web browser with DevTools

**VS Code Extensions Used:**
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint - JavaScript linting
- Auto Rename Tag
- GitLens - Git supercharged
- MongoDB for VS Code
- Thunder Client - API testing
- Tailwind CSS IntelliSense

---

## 6.3 TECHNOLOGY STACK OVERVIEW

### 6.3.1 Backend Technologies (MERN Stack - Server Side)

#### 6.3.1.1 Node.js
**Version:** 18.17.0  
**Purpose:** Server-side JavaScript runtime environment  

**Description:**
Node.js is built on Chrome's V8 JavaScript engine and enables JavaScript to run on the server side. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications.

**Why We Chose Node.js:**
1. **JavaScript Everywhere:** Same language for frontend and backend reduces context switching
2. **NPM Ecosystem:** Access to over 2 million packages
3. **High Performance:** Non-blocking architecture handles concurrent requests efficiently
4. **Scalability:** Event-driven architecture scales horizontally
5. **Active Community:** Large community support and regular updates
6. **Real-time Capabilities:** Perfect for chat features and live updates

**Implementation Example:**
```javascript
// Server initialization using Node.js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Aroma Luxe Server Running');
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

#### 6.3.1.2 Express.js
**Version:** 4.18.2  
**Purpose:** Web application framework for Node.js  

**Description:**
Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building RESTful APIs and handling HTTP requests.

**Key Features:**
- **Routing:** Define routes for different HTTP methods and URLs
- **Middleware:** Chain functions that execute during request-response cycle
- **Template Engines:** Support for various view rendering engines
- **Error Handling:** Centralized error handling mechanism
- **Static Files:** Serve static files like images, CSS, JavaScript

**Implementation in Our Project:**
```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware configuration
// Parse JSON bodies (limit: 50MB for image uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/designs', require('./routes/designRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '⚙️ Welcome to Aroma Luxe API',
    version: '2.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      users: '/api/users',
      reviews: '/api/reviews',
      wishlist: '/api/wishlist',
      notifications: '/api/notifications',
      designs: '/api/designs',
      chatbot: '/api/chatbot',
      contact: '/api/contact'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✨ Aroma Luxe Backend is ready!\n`);
});
```

**Explanation:**
1. **Line 1-4:** Import required packages - express, dotenv, cors, and database config
2. **Line 7:** Load environment variables from .env file
3. **Line 10:** Establish MongoDB connection
4. **Line 13:** Create Express application instance
5. **Line 16-17:** Configure body parsers to handle JSON and URL-encoded data with 50MB limit (for image uploads)
6. **Line 20-23:** Enable CORS to allow frontend to communicate with backend
7. **Line 26-35:** Mount route handlers for different API endpoints
8. **Line 38-53:** Root endpoint that displays API information
9. **Line 56-62:** Global error handler middleware
10. **Line 65-69:** Start server on specified port

#### 6.3.1.3 MongoDB & Mongoose
**MongoDB Version:** 6.0.5  
**Mongoose Version:** 8.0.3  
**Purpose:** NoSQL database and Object Data Modeling (ODM) library  

**Description:**
MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents. Mongoose is an ODM (Object Data Modeling) library that provides a schema-based solution to model application data.

**Why MongoDB:**
1. **Flexible Schema:** Easy to modify data structure as requirements change
2. **Scalability:** Horizontal scaling through sharding
3. **Performance:** Fast read/write operations
4. **JSON Format:** Natural fit with JavaScript/Node.js
5. **Rich Queries:** Powerful query language with aggregation
6. **Cloud-Ready:** MongoDB Atlas provides managed cloud database

**Database Connection Implementation:**
```javascript
// File: backend/config/db.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variable MONGODB_URI for connection string
 * Implements error handling and connection status logging
 */
const connectDB = async () => {
  try {
    // Connection options
    const options = {
      useNewUrlParser: true,      // Use new URL parser
      useUnifiedTopology: true,   // Use new topology engine
    };

    // Attempt connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    // Success message with host details
    console.log(`\n✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}\n`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error(`Error: ${error.message}`);
    // Exit process with failure code
    process.exit(1);
  }
};

module.exports = connectDB;
```

**User Schema Implementation:**
```javascript
// File: backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Defines the structure for user documents in MongoDB
 * Includes validation, default values, and methods
 */
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,                           // Remove whitespace
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  // User's email address (unique identifier)
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,                         // No duplicate emails
    lowercase: true,                      // Convert to lowercase
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },

  // Hashed password (never stored in plain text)
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false                         // Don't return password in queries by default
  },

  // User's phone number
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },

  // User role (user or admin)
  role: {
    type: String,
    enum: ['user', 'admin'],              // Only these values allowed
    default: 'user'
  },

  // User's address information
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },

  // Profile avatar URL
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },

  // Account status
  isActive: {
    type: Boolean,
    default: true
  },

  // Account creation date
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true                        // Automatically add createdAt and updatedAt
});

/**
 * Pre-save middleware to hash password before saving to database
 * Only runs if password is modified
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt (random data for hashing)
    const salt = await bcrypt.genSalt(10);
    
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare entered password with hashed password
 * Returns true if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Instance method to get public user data (without sensitive info)
 */
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    avatar: this.avatar,
    address: this.address
  };
};

// Create and export User model
module.exports = mongoose.model('User', userSchema);
```

**Explanation:**
- **Lines 11-69:** Define user schema with validation rules
- **Lines 80-96:** Pre-save hook that automatically hashes passwords before storing
- **Lines 102-104:** Method to compare passwords during login
- **Lines 109-119:** Method to return user data without sensitive information

#### 6.3.1.4 JWT (JSON Web Tokens)
**Version:** 9.0.2  
**Purpose:** Secure authentication and authorization  

**Description:**
JSON Web Tokens (JWT) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. In our application, JWT is used for stateless authentication, meaning the server doesn't need to store session information.

**JWT Structure:**
A JWT consists of three parts separated by dots (.):
```
Header.Payload.Signature
```

1. **Header:** Contains token type (JWT) and hashing algorithm (HS256)
2. **Payload:** Contains user data (user ID, role, etc.)
3. **Signature:** Ensures token hasn't been tampered with

**Implementation:**
```javascript
// File: backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT Token
 * Creates a token containing user ID that expires after specified time
 * @param {string} id - User's MongoDB _id
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },                              // Payload: user ID
    process.env.JWT_SECRET,              // Secret key for signing
    { expiresIn: process.env.JWT_EXPIRE || '7d' } // Token expiration
  );
};

/**
 * Register New User
 * POST /api/auth/register
 * Public access
 */
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 50 characters'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate phone number (10 digits)
    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      const cleanPhone = phone.replace(/[\s\-()]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be exactly 10 digits'
        });
      }
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response with token and user data
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

/**
 * Login User
 * POST /api/auth/login
 * Public access
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password using comparePassword method
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Get Current Logged-in User
 * GET /api/auth/me
 * Private access (requires token)
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

**JWT Authentication Middleware:**
```javascript
// File: backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect Routes Middleware
 * Verifies JWT token and adds user to request object
 * Usage: Apply to routes that require authentication
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from header: "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please login.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token payload and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Continue to next middleware/controller
    next();

  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token is invalid or has been tampered with'
    });
  }
};

/**
 * Authorize Roles Middleware
 * Restricts access to specific user roles
 * Usage: authorize('admin') or authorize('user', 'admin')
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
```

**Usage in Routes:**
```javascript
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const productController = require('../controllers/productController');

// Public routes (no authentication required)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Protected routes (authentication required)
router.post(
  '/', 
  protect,                    // Verify JWT token
  authorize('admin'),         // Only admin can access
  productController.createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  productController.updateProduct
);

module.exports = router;
```

---

### 6.3.2 Frontend Technologies (MERN Stack - Client Side)

#### 6.3.2.1 React.js
**Version:** 18.2.0  
**Purpose:** UI library for building interactive user interfaces  

**Description:**
React is a JavaScript library for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components that manage their own state.

**Key Concepts:**
1. **Components:** Reusable pieces of UI
2. **Props:** Data passed from parent to child components
3. **State:** Data that changes over time
4. **Hooks:** Functions to use state and lifecycle in functional components
5. **Virtual DOM:** Efficient rendering mechanism

**React Hooks Used:**
```javascript
import React, { useState, useEffect, useContext } from 'react';

// useState - Manage component state
const [count, setCount] = useState(0);

// useEffect - Side effects (API calls, subscriptions, etc.)
useEffect(() => {
  // Runs after component renders
  fetchData();
}, [dependency]); // Re-run when dependency changes

// useContext - Access global state
const { user } = useContext(AuthContext);
```

**Sample Component Implementation:**
```javascript
// File: frontend/src/components/ProductCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

/**
 * ProductCard Component
 * Displays product information in a card format
 * Includes animations, add to cart functionality
 * 
 * @param {Object} product - Product data object
 * @param {string} product._id - Product ID
 * @param {string} product.title - Product title
 * @param {string} product.description - Product description
 * @param {number} product.price - Product price
 * @param {Array} product.images - Array of image URLs
 * @param {number} product.stock - Available stock
 * @param {number} product.rating - Product rating (0-5)
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /**
   * Handle Add to Cart button click
   * Prevents event bubbling to card click
   * Adds product to cart and shows toast notification
   */
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click event
    
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart(product, 1);
    toast.success(`${product.title} added to cart!`, {
      position: 'bottom-right',
      autoClose: 2000
    });
  };

  /**
   * Handle card click - Navigate to product details page
   */
  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  /**
   * Format price with currency symbol
   */
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <motion.div
      // Animation properties
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -8,              // Move up on hover
        scale: 1.02,        // Slightly enlarge
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}
      transition={{ duration: 0.3 }}
      
      // Styling
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"      // Lazy load images for performance
        />
        
        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-xl px-4 py-2 bg-red-500 rounded">
              Out of Stock
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full hover:bg-red-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            toast.info('Wishlist feature');
          }}
        >
          <FiHeart className="text-red-500" />
        </button>
      </div>

      {/* Product Details Section */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-primary-500 transition-colors">
          {product.title}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          {/* Price */}
          <div>
            <span className="text-2xl font-bold text-primary-500">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs text-orange-500 mt-1">
                Only {product.stock} left!
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg'
              }
            `}
          >
            <FiShoppingCart className="w-5 h-5" />
            <span>Add</span>
          </motion.button>
        </div>

        {/* Category Tag */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {product.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
```

**Explanation:**
- **Lines 20-22:** Component receives product data as props
- **Lines 29-42:** Function to add product to cart with validation
- **Lines 47-49:** Function to navigate to product details
- **Lines 54-56:** Utility function to format price
- **Lines 58-75:** Motion div with hover animations
- **Lines 78-105:** Product image with overlays for stock status and featured badge
- **Lines 108-154:** Product information display (title, description, rating)
- **Lines 157-178:** Price display and add to cart button
- **Lines 181-186:** Category tag display

---

#### 6.3.2.2 React Router DOM
**Version:** 6.21.0  
**Purpose:** Client-side routing for React applications  

**Description:**
React Router enables navigation between different components/pages in a React application without page reload. It allows building single-page applications with navigation.

**Implementation:**
```javascript
// File: frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Route Protection Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// User Pages (Protected)
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import CustomDesign from './pages/CustomDesign';
import MyDesigns from './pages/MyDesigns';

// Admin Pages (Admin Only)
import Dashboard from './pages/Admin/Dashboard';
import Products from './pages/Admin/Products';
import AddProduct from './pages/Admin/AddProduct';
import EditProduct from './pages/Admin/EditProduct';
import AdminOrders from './pages/Admin/Orders';
import Users from './pages/Admin/Users';
import Designs from './pages/Admin/Designs';
import ContactMessages from './pages/Admin/ContactMessages';

/**
 * Main Application Component
 * Sets up routing, context providers, and layout
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            {/* Navigation Bar - Appears on all pages */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                {/* ========== Public Routes ========== */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* ========== Protected User Routes ========== */}
                {/* Requires authentication */}
                <Route element={<PrivateRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/custom-design" element={<CustomDesign />} />
                  <Route path="/my-designs" element={<MyDesigns />} />
                </Route>

                {/* ========== Admin Routes ========== */}
                {/* Requires authentication + admin role */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/products" element={<Products />} />
                  <Route path="/admin/products/add" element={<AddProduct />} />
                  <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/designs" element={<Designs />} />
                  <Route path="/admin/messages" element={<ContactMessages />} />
                </Route>

                {/* ========== 404 Not Found ========== */}
                <Route path="*" element={
                  <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                      <a href="/" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600">
                        Go Home
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </main>

            {/* Footer - Appears on all pages */}
            <Footer />
          </div>

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
```

**Protected Route Component:**
```javascript
// File: frontend/src/components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 * 
 * Usage: Wrap protected routes with this component
 * Example:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/profile" element={<Profile />} />
 *   </Route>
 */
const PrivateRoute = () => {
  const { user, token } = useAuth();

  // Check if user is authenticated
  if (!token || !user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Authenticated, render child routes
  return <Outlet />;
};

export default PrivateRoute;
```

**Admin Route Component:**
```javascript
// File: frontend/src/components/AdminRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute Component
 * Protects routes that require admin role
 * Redirects to login if not authenticated
 * Redirects to home if not admin
 * 
 * Usage: Wrap admin routes with this component
 * Example:
 *   <Route element={<AdminRoute />}>
 *     <Route path="/admin/dashboard" element={<Dashboard />} />
 *   </Route>
 */
const AdminRoute = () => {
  const { user, token } = useAuth();

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Authenticated and admin, render child routes
  return <Outlet />;
};

export default AdminRoute;
```

---

#### 6.3.2.3 Context API for State Management

**Authentication Context:**
```javascript
// File: frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create Context
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Provides authentication state and functions to entire app
 * Manages user data, token, login, logout, register
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Axios instance with auth header
  const api = axios.create({
    baseURL: API_URL
  });

  // Add token to requests if it exists
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  /**
   * Load user data from token on mount
   */
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  /**
   * Register new user
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} phone - User's phone number
   * @param {string} password - User's password
   */
  const register = async (name, email, phone, password) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        phone,
        password
      });

      // Store token
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      toast.success('Registration successful!');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password
      });

      // Store token
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Logout user
   * Clears token and user data
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully');
  };

  /**
   * Update user profile
   * @param {Object} updates - Fields to update
   */
  const updateProfile = async (updates) => {
    try {
      const { data } = await api.put('/auth/profile', updates);
      setUser(data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    api // Expose configured axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Cart Context:**
```javascript
// File: frontend/src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/**
 * CartProvider Component
 * Manages shopping cart state
 * Persists cart to localStorage
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Add item to cart
   * If item exists, increase quantity
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   */
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        // Item exists, update quantity
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // New item, add to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  /**
   * Remove item from cart
   * @param {string} productId - Product ID to remove
   */
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  /**
   * Update item quantity
   * Remove item if quantity becomes 0 or negative
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  /**
   * Get cart total price
   * @returns {number} - Total price
   */
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  /**
   * Get total number of items in cart
   * @returns {number} - Total item count
   */
  const getCartCount = () => {
    return cart.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  };

  /**
   * Check if product is in cart
   * @param {string} productId - Product ID to check
   * @returns {boolean}
   */
  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to use cart context
 * Usage: const { cart, addToCart, removeFromCart } = useCart();
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
```

---

## 6.4 KEY FEATURES IMPLEMENTATION

### 6.4.1 Product Management System

**Product Controller - Get All Products with Advanced Filtering:**
```javascript
// File: backend/controllers/productController.js
const Product = require('../models/Product');

/**
 * Get all products with filtering, sorting, and pagination
 * GET /api/products
 * Public access
 * 
 * Query Parameters:
 * - search: Search in title, description, tags
 * - category: Filter by category
 * - brand: Filter by brand (comma-separated for multiple)
 * - minPrice: Minimum price
 * - maxPrice: Maximum price
 * - rating: Minimum rating
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 12)
 * - sort: Sort field (default: -createdAt)
 * - featured: true/false to filter featured products
 * - inStock: true/false to filter in-stock products
 */
exports.getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      page = 1,
      limit = 12,
      sort = '-createdAt',
      featured,
      inStock
    } = req.query;

    // Build query object
    let query = {};

    // FILTER 1: Text Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },       // Case-insensitive
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // FILTER 2: Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // FILTER 3: Brand (supports multiple brands)
    if (brand) {
      const brands = brand.split(','); // "Nike,Adidas" -> ["Nike", "Adidas"]
      query.brand = { $in: brands };
    }

    // FILTER 4: Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);  // Greater than or equal
      if (maxPrice) query.price.$lte = Number(maxPrice);  // Less than or equal
    }

    // FILTER 5: Rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // FILTER 6: Featured Products
    if (featured === 'true') {
      query.featured = true;
    }

    // FILTER 7: In Stock
    if (inStock === 'true') {
      query.stock = { $gt: 0 }; // Greater than 0
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Execute query
    const products = await Product.find(query)
      .sort(sort)                    // Sort results
      .limit(limit * 1)              // Limit results
      .skip(skip)                    // Skip for pagination
      .select('-__v')                // Exclude version key
      .exec();

    // Get total count for pagination
    const count = await Product.countDocuments(query);

    // Send response
    res.status(200).json({
      success: true,
      products,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        limit: Number(limit),
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 * Public access
 */
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

/**
 * Create new product
 * POST /api/products
 * Private/Admin access
 */
exports.createProduct = async (req, res) => {
  try {
    // Validate required fields
    const { title, brand, price, category, description, images, stock } = req.body;

    if (!title || !brand || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one product image'
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    // Create product
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

/**
 * Update product
 * PUT /api/products/:id
 * Private/Admin access
 */
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,              // Return updated document
        runValidators: true     // Run model validators
      }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 * Private/Admin access
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};
```

### 6.4.2 Shopping Cart Implementation

**Shopping Cart Page:**
```javascript
// File: frontend/src/pages/Cart.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Cart Page Component
 * Displays shopping cart items with quantity controls
 * Shows cart total and checkout button
 */
const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();

  /**
   * Handle checkout button click
   * Requires authentication
   */
  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  /**
   * Format price with currency
   */
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <FiShoppingBag className="w-24 h-24 text-gray-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Add some products to get started</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-400">
            {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div
                    className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3
                      className="text-xl font-semibold text-gray-800 mb-2 cursor-pointer hover:text-primary-500 transition-colors"
                      onClick={() => navigate(`/product/${item._id}`)}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <div>
                        <p className="text-2xl font-bold text-primary-500">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Subtotal: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          {/* Decrease Quantity */}
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          >
                            <FiMinus />
                          </button>

                          {/* Quantity Display */}
                          <span className="px-4 py-2 font-semibold">
                            {item.quantity}
                          </span>

                          {/* Increase Quantity */}
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiPlus />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from cart"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.stock && (
                      <p className="text-orange-500 text-sm mt-2">
                        Maximum quantity reached ({item.stock} available)
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg sticky top-24"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold">{formatPrice(getCartTotal() * 0.1)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-primary-500">
                      {formatPrice(getCartTotal() * 1.1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-primary-500 text-white py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping Link */}
              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-4 text-gray-600 hover:text-primary-500 transition-colors"
              >
                ← Continue Shopping
              </button>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium">Secure Checkout</span>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Your payment information is secure
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
```

---

## 6.5 CHALLENGES FACED AND SOLUTIONS

### Challenge 1: CORS Issues
**Problem:** Frontend running on localhost:3000 couldn't communicate with backend on localhost:5000

**Solution:**
```javascript
// Configured CORS middleware in backend
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Challenge 2: Image Upload Handling
**Problem:** Large product images causing request payload too large errors

**Solution:**
```javascript
// Increased body parser limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Frontend: Compress images before upload
const compressImage = async (file) => {
  // Implementation using browser Canvas API
  const img = new Image();
  const canvas = document.createElement('canvas');
  // ... compression logic
};
```

### Challenge 3: State Persistence
**Problem:** Cart items lost on page refresh

**Solution:**
```javascript
// Implemented localStorage persistence in CartContext
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);

useEffect(() => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
```

### Challenge 4: Authentication Token Expiry
**Problem:** Users logged out unexpectedly when token expired

**Solution:**
```javascript
// Added token expiry handling in axios interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 6.6 CONCLUSION

The implementation phase successfully transformed the design specifications into a fully functional e-commerce platform. All modules were developed following industry best practices with proper error handling, validation, and security measures. The system demonstrates effective use of modern web technologies and provides a solid foundation for future enhancements.

Key achievements:
- ✅ Complete backend API with RESTful architecture
- ✅ Responsive React frontend with smooth user experience
- ✅ Secure authentication and authorization system
- ✅ Full CRUD operations for all entities
- ✅ Shopping cart with localStorage persistence
- ✅ Admin panel for business management
- ✅ AI-powered chatbot integration
- ✅ Comprehensive error handling and validation
