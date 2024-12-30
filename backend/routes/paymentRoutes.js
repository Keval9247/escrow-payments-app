const express = require('express');
const { createPayment, paymentSuccess, listPayments, createPayment23_12, purchaseProduct, fetchPayments, storePayment, } = require('../controllers/paymentController.js');
const authenticate = require('../middlewares/Authenticate.js');

const router = express.Router();

router.post('/create', authenticate, createPayment);
router.post('/create-payment-intent', createPayment23_12);
router.post('/success', paymentSuccess);


router.put('/purchase/:id', purchaseProduct)
router.get('/user/:userId', fetchPayments)

router.post('/', storePayment);
router.get('/list/:userId', listPayments);

module.exports = router;
