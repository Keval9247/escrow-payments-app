const express = require("express");
const {    getAllSellers,    verifySeller,    getPlatformStats,} = require("../controllers/superadminController.js");
const superadminMiddleware = require("../middlewares/superadminMiddleware.js");

const router = express.Router();

// Get all sellers
router.get("/sellers", superadminMiddleware, getAllSellers);

// Verify a seller
router.put("/sellers/:sellerId/verify", superadminMiddleware, verifySeller);

// Get platform statistics
router.get("/stats", superadminMiddleware, getPlatformStats);

module.exports = router;
