const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// @route   POST /api/payments/intent
// @desc    Create payment intent
// @access  Private
router.post('/intent', protect, paymentController.createPaymentIntent);

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', protect, paymentController.confirmPayment);

// @route   POST /api/payments/refund
// @desc    Process refund
// @access  Private (Admin or order owner)
router.post('/refund', protect, paymentController.processRefund);

// @route   GET /api/payments/history
// @desc    Get user payment history
// @access  Private
router.get('/history', protect, paymentController.getPaymentHistory);

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', protect, paymentController.getPaymentById);

// @route   GET /api/payments
// @desc    Get all payments
// @access  Private/Admin
router.get('/', protect, admin, paymentController.getAllPayments);

// @route   GET /api/payments/:id/invoice
// @desc    Generate invoice
// @access  Private
router.get('/:id/invoice', protect, paymentController.generateInvoice);

module.exports = router;
