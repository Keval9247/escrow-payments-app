import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api/api";

function AddProduct() {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const userfromLocal = JSON.parse(localStorage.getItem("AdminDetails"));
    const supplierId = userfromLocal?._id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if (!supplierId) {
            setError("Seller ID is missing. Please log in.");
            setLoading(false);
            return;
        }

        const productData = { ...product, supplierId };

        try {
            const res = await addProduct(productData);
            if (res.status === 201) {
                setMessage("Product added successfully!");
                setProduct({ name: "", price: "", description: "" });
                setTimeout(() => {
                    setLoading(false);
                    navigate("/dashboard");
                }, 1500);
            }
        } catch (error) {
            setError("Failed to add product. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    Add a New Product
                </h2>

                {/* Success and Error Messages */}
                {message && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter price"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter product description"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-medium text-lg transition duration-150 ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Adding Product..." : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
