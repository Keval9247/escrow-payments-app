const UserModel = require("../models/User.model");

exports.getStripeStatus = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        res.json({ isStripeConnected: !!user.stripeAccountId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch Stripe status.' });
    }
};

exports.disconnectStripe = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (user.stripeAccountId) {
            await stripe.accounts.del(user.stripeAccountId);
            user.stripeAccountId = null;
            await user.save();
        }

        res.json({ message: 'Stripe account disconnected successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to disconnect Stripe account.' });
    }
};

