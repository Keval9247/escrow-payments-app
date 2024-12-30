const User = require("../models/User.model");

// Get all joined sellers
exports.getAllSellers = async (req, res) => {
    try {
        const sellers = await User.find({ role: "admin" }).select("email isVerified stripeAccountId");
        res.json(sellers);
    } catch (error) {
        console.error("Error fetching sellers:", error);
        res.status(500).json({ error: "Failed to fetch sellers." });
    }
};

// Verify a seller
exports.verifySeller = async (req, res) => {
    const { sellerId } = req.params;

    try {
        const seller = await User.findById(sellerId);
        if (!seller || seller.role !== "admin") {
            return res.status(404).json({ error: "Seller not found." });
        }

        seller.isVerified = true;
        await seller.save();

        res.json({ message: "Seller verified successfully." });
    } catch (error) {
        console.error("Error verifying seller:", error);
        res.status(500).json({ error: "Failed to verify seller." });
    }
};

// Get platform statistics
exports.getPlatformStats = async (req, res) => {
    try {
        const totalSellers = await User.countDocuments({ role: "admin" });
        const verifiedSellers = await User.countDocuments({ role: "admin", isVerified: true });

        res.json({
            totalSellers,
            verifiedSellers,
        });
    } catch (error) {
        console.error("Error fetching platform stats:", error);
        res.status(500).json({ error: "Failed to fetch platform statistics." });
    }
};
