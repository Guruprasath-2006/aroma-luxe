const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser with increased limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS
app.use(cors());

// Routes
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
app.use('/api/reports', require('./routes/reportRoutes'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '⚙️ Welcome to Velan Engineering API - Professional Edition',
    version: '2.0.0',
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
      contact: '/api/contact',
      reports: '/api/reports'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✨ Aroma Luxe Backend is ready!\n`);
});
