// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
// });

// module.exports = mongoose.model('Product', productSchema);


const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        purchased: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
