const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const advancedProductController = require('../controllers/advancedProductController');

// ===== VARIANTS =====
router.post('/variants', protect, admin, advancedProductController.createVariant);
router.get('/variants/:productId', advancedProductController.getProductVariants);
router.put('/variants/:id', protect, admin, advancedProductController.updateVariant);
router.delete('/variants/:id', protect, admin, advancedProductController.deleteVariant);

// ===== BUNDLES =====
router.post('/bundles', protect, admin, advancedProductController.createBundle);
router.get('/bundles', advancedProductController.getActiveBundles);
router.get('/bundles/:id', advancedProductController.getBundleById);
router.put('/bundles/:id', protect, admin, advancedProductController.updateBundle);

// ===== FLASH SALES =====
router.post('/flash-sales', protect, admin, advancedProductController.createFlashSale);
router.get('/flash-sales', advancedProductController.getActiveFlashSales);
router.put('/flash-sales/:id', protect, admin, advancedProductController.updateFlashSale);

// ===== GIFT CARDS =====
router.post('/gift-cards', protect, advancedProductController.createGiftCard);
router.get('/gift-cards/balance/:code', advancedProductController.checkGiftCardBalance);
router.post('/gift-cards/redeem', protect, advancedProductController.redeemGiftCard);
router.get('/gift-cards/user/me', protect, advancedProductController.getUserGiftCards);

module.exports = router;
