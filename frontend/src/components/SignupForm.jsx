import React, { useState } from "react";
import { createStripeAccount, verifyStripeConnection } from "../api/api";
import axios from "axios";

function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [stripeLink, setStripeLink] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            const user = await axios.post("http://localhost:5000/api/auth/signup", formData);
            const stripeResponse = await createStripeAccount(user.data._id);
            localStorage.setItem("AdminDetails", JSON.stringify(stripeResponse?.user));
            setStripeLink(stripeResponse.accountLink);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Signup failed. Please try again.");
        }
        setLoading(false);
    };

    // const handleVerifyStripeStatus = async (stripeAccountId) => {
    //     setLoading(true);
    //     try {
    //         const response = await verifyStripeConnection(stripeAccountId);
    //         return response;
    //     } catch (error) {
    //         console.error("Error verifying Stripe connection:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Become a Seller Today!
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition duration-200"
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </button>
                </form>
                {errorMessage && (
                    <div className="mt-4 text-red-500 text-sm text-center">
                        {errorMessage}
                    </div>
                )}
                {stripeLink && (
                    <div className="mt-6 text-center">
                        <a
                            href={stripeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-200"
                        >
                            Complete Stripe Onboarding
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Signup;
