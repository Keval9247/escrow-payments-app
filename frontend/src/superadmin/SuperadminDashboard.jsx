import React, { useEffect, useState } from "react";
import axios from "axios";

const SuperadminDashboard = () => {
    const [sellers, setSellers] = useState([]);
    const [stats, setStats] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/superadmin/sellers");
                setSellers(data);
            } catch (err) {
                setError("Failed to fetch sellers.");
            }
        };

        const fetchStats = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/superadmin/stats");
                setStats(data);
            } catch (err) {
                setError("Failed to fetch platform statistics.");
            }
        };

        fetchSellers();
        fetchStats();
    }, []);

    const verifySeller = async (sellerId) => {
        try {
            await axios.put(`http://localhost:5000/api/superadmin/sellers/${sellerId}/verify`);
            alert("Seller verified successfully!");
            setSellers((prevSellers) =>
                prevSellers.map((seller) =>
                    seller._id === sellerId ? { ...seller, isVerified: true } : seller
                )
            );
        } catch (err) {
            setError("Failed to verify seller.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Superadmin Dashboard</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h2>Platform Statistics</h2>
            <p>Total Sellers: {stats.totalSellers}</p>
            <p>Verified Sellers: {stats.verifiedSellers}</p>

            <h2>Sellers</h2>
            {sellers.map((seller) => (
                <div
                    key={seller._id}
                    style={{
                        padding: "10px",
                        margin: "10px 0",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <p>Email: {seller.email}</p>
                    <p>Stripe Account: {seller.stripeAccountId || "Not Connected"}</p>
                    <p>Status: {seller.isVerified ? "Verified" : "Not Verified"}</p>
                    {!seller.isVerified && (
                        <button
                            onClick={() => verifySeller(seller._id)}
                            style={{
                                padding: "5px 10px",
                                backgroundColor: "#28A745",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Verify Seller
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SuperadminDashboard;
