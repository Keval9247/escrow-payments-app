import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuyProduct = ({ product, closeModel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handlePayment = async () => {
        if (!stripe || !elements) {
            setMessage("Stripe is not loaded.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Step 1: Create a payment intent on the backend
            const { data } = await axios.post("http://localhost:5000/api/payment/create", {
                amount: Math.round(product.price * 100), // Convert price to cents
                sellerId: product.sellerId?._id,
            }, { withCredentials: true });

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setMessage(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                setMessage("Payment successful!");
                closeModel();
            }
        } catch (error) {
            console.error("Payment failed:", error.response);
            setMessage(error.response.data.error);
            setTimeout(() => {
                setMessage("Redirecting to Login...")
                // closeModel()
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000);
            }, 1500)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <CardElement />
            <button
                onClick={handlePayment}
                disabled={loading || !stripe}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
                {loading ? "Processing..." : `Pay $${product.price}`}
            </button>
            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
    );
};

export default BuyProduct;
