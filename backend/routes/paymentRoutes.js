const express = require('express');
const router = express.Router();
const { 
  createCheckoutSession, 
  handleWebhook, 
  getUserPurchases, 
  verifyPurchase,
  verifySession
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/create-checkout-session', createCheckoutSession);
router.get('/verify-session/:sessionId', verifySession);

// Special route for Stripe webhooks (raw body is already handled in server.js)
router.post('/webhook', handleWebhook);

// Protected routes
router.get('/purchases', protect, getUserPurchases);
router.get('/verify-purchase/:productId', protect, verifyPurchase);

module.exports = router;
