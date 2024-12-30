const express = require('express');
const authRoutes = require('./authRoutes');
const paymentRoutes = require('./paymentRoutes');
const stripeRoutes = require('./stripeRoutes');
const superadminRoutes = require('./superadminRoutes');
const productRoutes = require('./productRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/payment', paymentRoutes);

router.use('/stripe', stripeRoutes);
router.use("/superadmin", superadminRoutes);
router.use('/products', productRoutes);

module.exports = router;
