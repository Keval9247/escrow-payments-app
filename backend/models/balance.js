const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const balanceSchema = new Schema({
    currency: { type: String, required: true },
    available: { type: Number, default: 0 },
    used: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Balance', balanceSchema);