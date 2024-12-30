const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  role: { type: String, enum: ["superadmin", "admin", "user"], required: false },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  // stripeCustomerId: { type: String, default: null },
  stripeAccountId: { type: String, default: null },
  isStripeConnected: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
