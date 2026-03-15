const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const inventoryController = require('../controllers/inventoryController');

// @route   GET /api/inventory/overview
// @desc    Get inventory overview
// @access  Private/Admin
router.get('/overview', protect, admin, inventoryController.getInventoryOverview);

// @route   GET /api/inventory/low-stock
// @desc    Get low stock alerts
// @access  Private/Admin
router.get('/low-stock', protect, admin, inventoryController.getLowStockAlerts);

// @route   POST /api/inventory/adjust
// @desc    Adjust inventory
// @access  Private/Admin
router.post('/adjust', protect, admin, inventoryController.adjustInventory);

// @route   POST /api/inventory/bulk-update
// @desc    Bulk update inventory
// @access  Private/Admin
router.post('/bulk-update', protect, admin, inventoryController.bulkUpdateInventory);

// @route   GET /api/inventory/logs
// @desc    Get inventory logs
// @access  Private/Admin
router.get('/logs', protect, admin, inventoryController.getInventoryLogs);

// @route   GET /api/inventory/value-report
// @desc    Get inventory value report
// @access  Private/Admin
router.get('/value-report', protect, admin, inventoryController.getInventoryValueReport);

module.exports = router;
