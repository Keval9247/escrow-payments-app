import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { verifyStripeConnection } from "../api/api";

const Dashboard = () => {
    const [stripeStatus, setStripeStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [loginLink, setLoginLink] = useState("");
    const [products, setProducts] = useState([]);
    const user = JSON.parse(localStorage.getItem("AdminDetails"));
    const navigate = useNavigate();

    // Fetch Stripe status and login link
    useEffect(() => {
        const verifyStripeStatus = async () => {
            try {
                if (!user?.stripeAccountId) {
                    setMessage("Stripe account ID is missing.");
                    return;
                }

                const data = await verifyStripeConnection(user?.stripeAccountId);
                setStripeStatus(data.isStripeConnected);

                if (data.isStripeConnected) {
                    const { data: linkData } = await axios.get(
                        `http://localhost:5000/api/auth/login-link/${user.stripeAccountId}`
                    );
                    setLoginLink(linkData.loginLink);
                }
            } catch (error) {
                setMessage("Failed to verify Stripe status.");
            }
        };

        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:5000/api/products/user/${user?._id}`
                );
                setProducts(data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        if (user) {
            verifyStripeStatus();
            fetchProducts();
        }
    }, [user?.stripeAccountId, user?._id]);


    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user])

    return (
        <div
            style={{
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1 style={{ fontSize: "28px", color: "#333", marginBottom: "10px" }}>
                    Welcome, {user?.name}
                </h1>
                <span style={{ fontSize: "16px", color: "#999" }}>Email : {user?.email}</span>
                <p style={{ fontSize: "16px", color: "#555" }}>
                    Stripe Status:{" "}
                    <span
                        style={{
                            color: stripeStatus ? "green" : "red",
                            fontWeight: "bold",
                        }}
                    >
                        {stripeStatus ? "Connected" : "Not Connected"}
                    </span>
                </p>
                {!stripeStatus && user?.stripeAccountId && (
                    <p style={{ fontSize: "14px", color: "#f00" }}>
                        Your Stripe account is not connected. Please complete onboarding.
                    </p>
                )}
                {message && <p style={{ fontSize: "14px", color: "#555" }}>{message}</p>}
            </div>

            {/* Action Buttons */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                <a
                    href="/add-product"
                    style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                    }}
                >
                    Add New Product
                </a>
                {loginLink && (
                    <a
                        href={loginLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            padding: "10px 20px",
                            backgroundColor: "#28a745",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "5px",
                            fontSize: "16px",
                        }}
                    >
                        Open Stripe Dashboard
                    </a>
                )}
            </div>

            {/* Products Section */}
            <div>
                <h2 style={{ fontSize: "22px", color: "#333", marginBottom: "20px" }}>
                    Your Products
                </h2>
                {products.length > 0 ? (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {products.map((product) => (
                            <div
                                key={product._id}
                                style={{
                                    backgroundColor: "white",
                                    padding: "15px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <h3 style={{ fontSize: "18px", color: "#333" }}>
                                    {product.name}
                                </h3>
                                <p style={{ fontSize: "14px", color: "#555" }}>
                                    Price: <strong>${product.price}</strong>
                                </p>
                                <p style={{ fontSize: "14px", color: "#555" }}>
                                    Description: {product.description || "No description provided."}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p
                        style={{
                            fontSize: "16px",
                            color: "#555",
                            textAlign: "center",
                            marginTop: "20px",
                        }}
                    >
                        No products found. Start adding products!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
