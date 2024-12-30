const express = require('express');
const { getAllProducts, getProductById, addProduct, getSupplierdetails, updateProducts, getProductsBySellerId, getProductByUserID } = require('../controllers/ProductsController');
const authenticate = require('../middlewares/Authenticate');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:productId', getProductById);

router.post('/', addProduct);

router.get('/user/:userId', getProductByUserID)
router.get('/supplier/:supplier', getSupplierdetails)
router.put('/:id', updateProducts)
router.get('/seller/:sellerId', getProductsBySellerId)

module.exports = router;
