const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const shippingController = require('../controllers/shippingController');

// @route   POST /api/shipping
// @desc    Create shipping record
// @access  Private/Admin
router.post('/', protect, admin, shippingController.createShipping);

// @route   GET /api/shipping/order/:orderId
// @desc    Get shipping by order ID
// @access  Private
router.get('/order/:orderId', protect, shippingController.getShippingByOrder);

// @route   PUT /api/shipping/:id/status
// @desc    Update shipping status
// @access  Private/Admin
router.put('/:id/status', protect, admin, shippingController.updateShippingStatus);

// @route   GET /api/shipping/track/:trackingNumber
// @desc    Track shipment
// @access  Public
router.get('/track/:trackingNumber', shippingController.trackShipment);

// @route   POST /api/shipping/calculate-rate
// @desc    Calculate shipping rate
// @access  Public
router.post('/calculate-rate', shippingController.calculateShippingRate);

// @route   GET /api/shipping
// @desc    Get all shipments
// @access  Private/Admin
router.get('/', protect, admin, shippingController.getAllShipments);

// @route   GET /api/shipping/user/me
// @desc    Get user's shipments
// @access  Private
router.get('/user/me', protect, shippingController.getUserShipments);

module.exports = router;
