const Stripe = require('stripe');
const UserModel = require('../models/User.model');
const ProductModel = require('../models/Product.model');
const PaymentModel = require('../models/Payment.model');
const stripe = new Stripe(process.env.STRIPESECRETKEY);

exports.createPayment = async (req, res) => {
    const { amount, sellerId } = req.body;

    try {
        if (!req?.session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized: User not logged in.' });
        }
        const buyerId = req.session.user.id;
        const seller = await UserModel.findById(sellerId);
        if (!seller || !seller.stripeAccountId) {
            return res.status(400).json({ error: 'Seller not connected to Stripe.' });
        }

        // Retrieve account capabilities
        const account = await stripe.accounts.retrieve(seller.stripeAccountId);

        if (account.capabilities.transfers !== 'active') {
            return res.status(400).json({
                error: 'Seller account is not ready to receive payments. Please complete onboarding.',
            });
        }

        const applicationFee = Math.round((amount * 10) / 100);
        const transferGroup = `group_${sellerId}_${new Date().getTime()}`;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            // payment_method: sellerId,
            // capture_method: 'automatic',
            // confirm: true,
            // setup_future_usage: 'off_session',
            // customer: buyerId, // Logged-in buyer's ID
            // on_behalf_of: seller.stripeAccountId,
            transfer_group: transferGroup,
            metadata: {
                buyerId,
                sellerId,
                stripeAccountId: seller.stripeAccountId,
                applicationFee,
            },
            // transfer_data: {  // enable only for instant. 
            //     destination: seller.stripeAccountId,
            // },
            // application_fee_amount: applicationFee,
        });

        const paymentIntenta = await stripe.paymentIntents.retrieve(paymentIntent.id);
        console.log("🚀🚀 Your selected text is paymentIntent: ", paymentIntenta);

        const payment = new PaymentModel({
            userId: buyerId,
            sellerId: seller._id,
            stripeAccountId: seller.stripeAccountId,
            amount,
            applicationFee,
            paymentIntentId: paymentIntent.id,
            status: 'pending',
            transferGroup,
        });

        await payment.save();

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ error: 'Failed to create payment.' });
    }
};

exports.storePayment = async (req, res) => {
    const { seller, amount, paymentIntent } = req.body;
    try {
        const newPayment = await PaymentModel.create({
            userId: buyerId,
            sellerId: seller._id,
            stripeAccountId: seller.stripeAccountId,
            amount,
            applicationFee,
            paymentIntentId: paymentIntent.id,
            status: 'pending',
            transferGroup,
        });

        res.status(201).json({ message: "Payment details stored successfully.", payment: newPayment });
    } catch (error) {
        console.error("Error storing payment details:", error.message);
        res.status(500).json({ message: "Failed to store payment details." });
    }
};

exports.paymentSuccess = async (req, res) => {
    const { paymentIntentId } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            res.json({ message: 'Payment successful', paymentIntent });
        } else {
            res.status(400).json({ error: 'Payment not completed.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to confirm payment success.' });
    }
};

exports.listPayments = async (req, res) => {
    const { userId } = req.params;
    try {
        const payments = await PaymentModel.find({ userId });
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch payments.' });
    }
};

exports.fetchPayments = async (req, res) => {
    const { userId } = req.params;
    try {
        // Fetch all payments for the user
        const payments = await PaymentModel.find({ sellerId: userId }).sort({ createdAt: -1 });

        res.status(200).json({ payments });
    } catch (error) {
        console.error('Error fetching payments:', error.message);
        res.status(500).json({ message: 'Failed to fetch payments.' });
    }
};

exports.createPayment23_12 = async (req, res) => {
    const { productId } = req.body;

    try {
        const product = await ProductModel.findById(productId).populate("sellerId");
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Ensure the supplier has a connected Stripe account
        const supplier = product.sellerId;
        if (!supplier || !supplier.isStripeConnected) {
            return res.status(400).json({ message: "Supplier is not connected to Stripe" });
        }

        // Create Payment Intent for the supplier's Stripe account
        const paymentIntent = await stripe.paymentIntents.create({
            // amount: product.price * 100, // Stripe requires amounts in cents
            amount: product.price,
            currency: "usd",
            payment_method_types: ["card"],
            application_fee_amount: Math.round(product.price * 0.1 * 100), // 10% fee for platform
            transfer_data: {
                destination: supplier.stripeAccountId,
            },
            transfer_group: `group_${supplier.stripeAccountId}`, // Group this payment for the seller
        });

        await PaymentModel.create({
            productId: product._id,
            sellerId: supplier._id,
            paymentIntentId: paymentIntent.id,
            status: "pending",
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: "Failed to create payment intent" });
    }
}

exports.transferFunds = async (payment) => {
    try {
        const transfer = await stripe.transfers.create({
            amount: payment.amount, // Use the stored amount in cents
            currency: "usd",
            destination: payment.seller.stripeAccountId,
            transfer_group: `group_${payment.seller._id}`,
        });

        // Update payment status in the database
        payment.status = "transferred";
        payment.transferId = transfer.id;
        await payment.save();

        console.log(`Funds transferred to seller: ${payment.seller._id}`);
    } catch (error) {
        console.error("Error transferring funds:", error.message);
    }
};

exports.purchaseProduct = async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            req.params.id,
            { purchased: true },
            { new: true }
        );
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: "Failed to update purchase status" });
    }
}

