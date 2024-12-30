const cron = require("node-cron");
const stripe = require("stripe")(process.env.STRIPESECRETKEY);
const PaymentModel = require("../models/Payment.model");

const scheduleDelayedTransfers = () => {
    cron.schedule("*/1 * * * *", async () => {
        console.log("Running scheduled task to process escrow payments...");

        try {
            // Calculate date 3 days ago  :  
            const oneMinuteAgo = new Date();
            oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

            // Find payments that were created 3 days ago and are still pending
            const duePayments = await PaymentModel.find({
                status: "pending",
                createdAt: { $lte: oneMinuteAgo }
            });

            console.log(`Found ${duePayments.length} payments ready for transfer after ${getHoldTime(duePayments)} hold`);

            // Get platform balance
            const balance = await stripe.balance.retrieve();
            const availableGBP = balance.available.find(b => b.currency === 'gbp')?.amount || 0;

            for (const payment of duePayments) {
                await processEscrowTransfer(payment, availableGBP);
            }

            // Monitor and maintain minimum balance
            await monitorBalance();
        } catch (error) {
            console.error("Error processing scheduled payments:", error);
        }
    });
};

const processEscrowTransfer = async (payment, availableBalance) => {
    try {
        // Validate payment data
        if (!payment.stripeAccountId || !payment.amount) {
            console.error(`Invalid payment data for payment ${payment._id}`);
            payment.status = 'failed';
            payment.error = 'Invalid payment data';
            await payment.save();
            return;
        }

        // Calculate the waiting period  :=>  Here we can set waiting period based on our need.
        const waitingPeriod = 1 * 60 * 1000; // 1 minute in milliseconds
        const releaseDate = new Date(payment.createdAt.getTime() + waitingPeriod);

        // Double check if it's time to release
        if (new Date() < releaseDate) {
            console.log(`Payment ${payment._id} is still within hold period. Release date: ${releaseDate}`);
            return;
        }

        const transferAmount = payment.amount - (payment.applicationFee || 0);

        // Check if we have sufficient balance
        if (transferAmount > availableBalance) {
            console.log(`Insufficient balance for payment ${payment._id}. Required: ${transferAmount}, Available: ${availableBalance}`);
            await handleInsufficientBalance(payment, transferAmount - availableBalance);
            return;
        }

        // Create transfer to connected account
        const transfer = await stripe.transfers.create({
            amount: transferAmount,
            currency: "gbp",
            destination: payment.stripeAccountId,
            transfer_group: payment.transferGroup || `payment_${payment._id}`,
            metadata: { /**metadata is optional */
                paymentId: payment._id.toString(),
                holdPeriod: "1_minute",
                originalCreatedDate: payment.createdAt.toISOString(),
                releaseDate: releaseDate.toISOString(),
                platformFee: payment.applicationFee || 0
            }
        });

        // Update payment record
        payment.status = "completed";
        payment.transferId = transfer.id;
        payment.completedAt = new Date();
        payment.releaseDate = releaseDate;
        payment.retryCount = 0;
        await payment.save();

        console.log(`Escrow transfer completed for payment ${payment._id} after 1 minute hold - Transfer ID: ${transfer.id}`);

    } catch (error) {
        console.error(`Error processing escrow transfer for payment ${payment._id}:`, error);
        await handleTransferError(payment, error);
    }
};

const handleInsufficientBalance = async (payment, shortfall) => {
    try {
        payment.status = "pending_balance";
        payment.retryCount = (payment.retryCount || 0) + 1;
        payment.lastRetryAt = new Date();
        payment.shortfall = shortfall;
        await payment.save();

        if (shortfall >= 10000) { // Only replenish if shortfall is significant (≥ £100)
            await replenishBalance(shortfall + 50000); // Add buffer of £500
        }

        console.log(`Payment ${payment._id} deferred due to insufficient balance. Shortfall: £${shortfall / 100}`);
    } catch (error) {
        console.error(`Error handling insufficient balance for payment ${payment._id}:`, error);
    }
};

const handleTransferError = async (payment, error) => {
    if (error.type === 'StripeError') {
        payment.error = {
            code: error.raw?.code,
            message: error.raw?.message,
            timestamp: new Date()
        };

        if (error.raw?.code === "balance_insufficient") {
            payment.retryCount = (payment.retryCount || 0) + 1;
            payment.status = payment.retryCount >= 3 ? "failed" : "pending_balance";
        } else {
            payment.status = "failed";
        }

        await payment.save();
    }
};

const monitorBalance = async () => {
    try {
        const balance = await stripe.balance.retrieve();
        const availableGBP = balance.available.find(b => b.currency === 'gbp')?.amount || 0;
        const minimumBalance = 100000; // £1,000 minimum balance

        console.log(`Current GBP balance: £${availableGBP / 100}`);

        if (availableGBP < minimumBalance) {
            const replenishmentAmount = minimumBalance - availableGBP + 50000; // Add £500 buffer
            await replenishBalance(replenishmentAmount);
        }
    } catch (error) {
        console.error("Error monitoring balance:", error);
    }
};

const replenishBalance = async (amount) => {
    try {
        const charge = await stripe.charges.create({
            amount,
            currency: "gbp",
            source: "tok_bypassPending", // Test token - replace with real source in production
            description: "Platform balance replenishment",
            metadata: {
                type: "automatic_replenishment",
                timestamp: new Date().toISOString()
            }
        });

        console.log(`Balance replenished with £${amount / 100}. Charge ID: ${charge.id}`);
        return charge;
    } catch (error) {
        console.error("Error replenishing balance:", error);
        throw error;
    }
};
const getHoldTime = (payments) => {
    if (!payments.length) return "0 seconds";

    const now = new Date();
    const holdTimes = payments.map(payment => {
        const createdDate = new Date(payment.createdAt);
        const diffMs = now - createdDate;

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        if (diffMinutes > 0) return `${diffMinutes} minute(s)`;
        return `${diffSeconds} second(s)`;
    });

    return holdTimes[0];
};

module.exports = scheduleDelayedTransfers;