const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Buyer ID
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Seller ID
    stripeAccountId: { type: String, required: true },
    amount: { type: Number, required: true },
    applicationFee: { type: Number, required: true },
    transferGroup: { type: String, required: true }, // To group payment and transfer
    transferId: { type: String },
    paymentIntentId: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "failed", "deferred"], default: "pending" },
    errorMessage: { type: String },
    retryCount: { type: Number, default: 0 },
    lastError: {
        code: String,
        message: String,
        timestamp: Date
    },
    deferredReason: String,

    shortfallAmount: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
