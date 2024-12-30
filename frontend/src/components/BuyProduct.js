import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { createPaymentIntent, updatePurchaseStatus } from "../api/api";

function BuyProduct({ productId }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { clientSecret } = await createPaymentIntent(productId);

            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                setMessage(error.message);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                await updatePurchaseStatus(productId);
                setMessage("Payment successful! Product marked as purchased.");
            }
        } catch (error) {
            setMessage("Payment failed. Please try again.");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Buy Product</h2>
            {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
            <form onSubmit={handleSubmit}>
                <CardElement className="border px-4 py-3 rounded" />
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={!stripe}
                >
                    Pay Now
                </button>
            </form>
        </div>
    );
}

export default BuyProduct;
