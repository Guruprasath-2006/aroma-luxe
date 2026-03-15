const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// @route   GET /api/analytics/sales
// @desc    Get sales analytics
// @access  Private/Admin
router.get('/sales', protect, admin, analyticsController.getSalesAnalytics);

// @route   GET /api/analytics/products
// @desc    Get product analytics
// @access  Private/Admin
router.get('/products', protect, admin, analyticsController.getProductAnalytics);

// @route   GET /api/analytics/customers
// @desc    Get customer analytics
// @access  Private/Admin
router.get('/customers', protect, admin, analyticsController.getCustomerAnalytics);

// @route   GET /api/analytics/revenue
// @desc    Get revenue report
// @access  Private/Admin
router.get('/revenue', protect, admin, analyticsController.getRevenueReport);

// @route   GET /api/analytics/export
// @desc    Export analytics report
// @access  Private/Admin
router.get('/export', protect, admin, analyticsController.exportAnalyticsReport);

module.exports = router;
