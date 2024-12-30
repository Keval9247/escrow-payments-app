import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHER_KEY);

const CheckoutForm = ({ sellerId, productId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        setError(null);

        // Validate amount
        if (!amount || amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        if (!stripe || !elements) {
            setError("Stripe is not loaded.");
            return;
        }

        setLoading(true);

        try {
            // Step 1: Create a payment intent on the backend
            const { data } = await axios.post("http://localhost:5000/api/payment/create", {
                amount: Math.round(amount * 100), // Convert amount to cents
                sellerId, // Seller's Stripe account ID
            });

            // Step 2: Confirm the payment using Stripe's API
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
                setSuccess(true);
                alert("Payment successful!");

                // Step 3: Store payment details in the backend
                const paymentDetails = {
                    productId,
                    sellerId,
                    paymentIntentId: result.paymentIntent.id,
                    amount: result.paymentIntent.amount,
                    status: "pending", // Default status for the payment
                };

                await axios.post("http://localhost:5000/api/payments", paymentDetails);
                alert("Payment details stored successfully!");
                window.location.href = "/success"; // Redirect to success page
            }
        } catch (err) {
            console.error("Payment failed:", err);
            setError("Failed to process the payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", padding: "20px" }}>
            <h1>Make a Payment</h1>
            <CardElement />
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    margin: "20px 0",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                }}
            />
            <button
                onClick={handlePayment}
                disabled={!stripe || loading}
                style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: loading ? "#6c757d" : "#28A745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Processing..." : "Pay"}
            </button>
            {success && <p style={{ color: "green", marginTop: "10px" }}>Payment Successful!</p>}
        </div>
    );
};

const Payment = ({ sellerId, productId }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm sellerId={sellerId} productId={productId} />
        </Elements>
    );
};

export default Payment;
