const express = require('express');
const router = express.Router();
const { getChatResponse, getProductImages } = require('../controllers/chatbotController.ai');

// @route   POST /api/chatbot/chat
// @desc    Get AI chatbot response with image suggestions (Real AI)
// @access  Public
router.post('/chat', getChatResponse);

// @route   GET /api/chatbot/images
// @desc    Get product images by type or material
// @access  Public
router.get('/images', getProductImages);

module.exports = router;
