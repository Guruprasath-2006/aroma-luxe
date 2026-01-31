const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Public route - Submit contact form
router.post('/', createContact);

// Admin routes - Manage contact messages
router.get('/admin', protect, authorize('admin'), getAllContacts);
router.get('/:id', protect, authorize('admin'), getContact);
router.patch('/:id', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;
