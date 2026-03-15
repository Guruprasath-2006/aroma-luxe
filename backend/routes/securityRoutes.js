const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const securityController = require('../controllers/securityController');

// @route   GET /api/security/logs
// @desc    Get security logs
// @access  Private/Admin
router.get('/logs', protect, admin, securityController.getSecurityLogs);

// @route   PUT /api/security/logs/:id/resolve
// @desc    Resolve security log
// @access  Private/Admin
router.put('/logs/:id/resolve', protect, admin, securityController.resolveSecurityLog);

// ===== TWO-FACTOR AUTHENTICATION =====

// @route   POST /api/security/2fa/setup
// @desc    Setup 2FA
// @access  Private
router.post('/2fa/setup', protect, securityController.setup2FA);

// @route   POST /api/security/2fa/verify
// @desc    Verify and enable 2FA
// @access  Private
router.post('/2fa/verify', protect, securityController.verify2FA);

// @route   POST /api/security/2fa/disable
// @desc    Disable 2FA
// @access  Private
router.post('/2fa/disable', protect, securityController.disable2FA);

// @route   POST /api/security/2fa/validate
// @desc    Validate 2FA token
// @access  Public (used during login)
router.post('/2fa/validate', securityController.validate2FAToken);

// @route   GET /api/security/2fa/status
// @desc    Get 2FA status
// @access  Private
router.get('/2fa/status', protect, securityController.get2FAStatus);

module.exports = router;
