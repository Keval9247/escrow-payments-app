import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import BuyProduct from "./stripe/BuyProduct";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHER_KEY);

function ProductListing() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/products/", { withCredentials: true });
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleBuyClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Available Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        <h2 className="text-xl font-semibold text-gray-700">{product.name}</h2>
                        <p className="text-gray-600 mt-2">
                            Price: <span className="text-green-600 font-bold">${product.price}</span>
                        </p>
                        <p className="text-gray-600 mt-1">Seller: {product.sellerId?.email || "Unknown"}</p>
                        <button
                            onClick={() => handleBuyClick(product)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal for Payment */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-bold text-gray-700 mb-4">{selectedProduct.name}</h2>
                        <p className="text-gray-600 mb-4">
                            Price: <span className="text-green-600 font-bold">${selectedProduct.price}</span>
                        </p>
                        <Elements stripe={stripePromise}>
                            <BuyProduct product={selectedProduct} closeModel={handleCloseModal} />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductListing;
