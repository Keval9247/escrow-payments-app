const express = require('express');
const { getStripeStatus, disconnectStripe, } = require('../controllers/stripeController.js');

const router = express.Router();

// Get Stripe connection status for a user
router.get('/status/:userId', getStripeStatus);

// Disconnect Stripe account for a user
router.post('/disconnect/:userId', disconnectStripe);

module.exports = router;
