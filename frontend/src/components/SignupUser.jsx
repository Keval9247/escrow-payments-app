import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupUser() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    // const [stripeLink, setStripeLink] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            const user = await axios.post("http://localhost:5000/api/auth/signup/user", formData);
            localStorage.setItem("UserDetails", JSON.stringify(user.data));
            navigate('/products')
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Signup failed. Please try again.");
        }
        setLoading(false);
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Become a User Today!
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
            </div>
        </div>
    );
}

export default SignupUser;
