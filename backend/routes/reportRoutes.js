const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  generateSalesReport,
  generateProductReport,
  generateCustomerReport,
  exportReport
} = require('../controllers/reportController');

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Get reports
router.get('/sales', generateSalesReport);
router.get('/products', generateProductReport);
router.get('/customers', generateCustomerReport);

// Export reports as CSV
router.get('/export/:type', exportReport);

module.exports = router;
