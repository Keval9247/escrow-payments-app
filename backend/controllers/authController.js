require('dotenv').config();
const User = require('../models/User.model');
const { hashPassword } = require('../utils/authUtils');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPESECRETKEY);
const bcrypt = require('bcrypt');
const UserModel = require('../models/User.model');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = new User({ name, email, password, role: "admin" });
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: "Failed to register user" });
    }
};

exports.signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password, role: "user" });
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: "Failed to register user" });
    }
}

exports.GetCustomer = async (req, res) => {
    try {
        const user = await UserModel.find();
        res.status(200).json({
            users: user
        })
    } catch (error) {
        console.error("Error :", error);
    }
}

exports.CreateStripeSccount = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const account = await stripe.accounts.create({
            type: "express",
            email: user.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            country: "GB",
            settings: {
                payouts: {
                    schedule: {
                        interval: 'manual', // This stops automatic payouts for all accounts 
                    },
                },
            },
        });

        const accountDetails = await stripe.accounts.retrieve(account.id);

        const isEnabled =
            accountDetails.capabilities.card_payments === "active" &&
            accountDetails.capabilities.transfers === "active";

        user.stripeAccountId = account.id;
        await user.save();

        // Generate account onboarding link
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: "http://localhost:5173/dashboard?onboarding=failed",
            return_url: `http://localhost:5173/dashboard?userId=${userId}`,
            type: "account_onboarding",
        });

        return res.status(200).json({ accountLink: accountLink.url, user: user });
    } catch (error) {
        console.error("Stripe Account Creation Error:", error);
        return res.status(500).json({
            message: "Failed to create Stripe account",
            error: error.message,
        });
    }
}

exports.VerifyStripeConnection = async (req, res) => {
    const { stripeAccountId } = req.body;

    try {
        const accountDetails = await stripe.accounts.retrieve(stripeAccountId);

        const isEnabled =
            accountDetails.capabilities.card_payments === "active" &&
            accountDetails.capabilities.transfers === "active";

        if (isEnabled) {
            const user = await UserModel.findOne({ stripeAccountId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.isStripeConnected = true;
            await user.save();

            return res.status(200).json({ message: "Stripe account is fully connected", isStripeConnected: true });
        } else {
            return res.status(400).json({ message: "Stripe account is not fully enabled yet" });
        }
    } catch (error) {
        console.error("Stripe Verification Error:", error);
        return res.status(500).json({ message: "Failed to verify Stripe connection", error: error.message });
    }
};

exports.HandleReturnURL = async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const accountDetails = await stripe.accounts.retrieve(user.stripeAccountId);

        const isEnabled =
            accountDetails.capabilities.card_payments === "active" &&
            accountDetails.capabilities.transfers === "active";

        user.isStripeConnected = isEnabled;
        await user.save();

        if (isEnabled) {
            return res.status(200).json({ message: "Stripe account is fully connected", isStripeConnected: true });
        } else {
            return res.status(400).json({ message: "Stripe account is not fully enabled yet", isStripeConnected: false });
        }
    } catch (error) {
        console.error("Stripe Return URL Handling Error:", error);
        return res.status(500).json({
            message: "Failed to verify Stripe connection at return URL",
            error: error.message,
        });
    }
};

const getLoginLink = async (accountId) => {
    try {
        const loginLink = await stripe.accounts.createLoginLink(accountId);
        return loginLink.url;
    } catch (error) {
        console.error('Error generating login link:', error);
        throw error;
    }
};
exports.generateLoginLink = async (req, res) => {
    const { accountId } = req.params;
    try {
        const loginLink = await getLoginLink(accountId);
        res.status(200).json({ success: true, loginLink });
    } catch (error) {
        console.error('Error generating login link:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getStripeStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ isStripeConnected: user.isStripeConnected });
    } catch (error) {
        res.status(400).json({ message: "Failed to fetch Stripe status" });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email, password }).select("-password");
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }
        req.session.user = {
            id: user._id.toString(),
            email: user.email,
            stripeAccountId: user.stripeAccountId || null,
        };

        return res.status(200).json({
            message: "Login successful",
            user: user
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Failed to log in." });
    }
};

exports.getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user details.' });
    }
};

exports.reauth = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.stripeAccountId) {
            return res.status(400).json({ error: 'User does not have a Stripe account.' });
        }
        const accountLink = await stripe.accountLinks.create({
            account: user.stripeAccountId,
            refresh_url: 'http://localhost:5173/reauth',
            return_url: 'http://localhost:5173/success',
            type: 'account_onboarding',
        });

        res.json({ url: accountLink.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create reauth link.' });
    }
};


