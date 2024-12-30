import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const { data } = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            }, { withCredentials: true });
            const role = data?.user?.role;
            role === "admin"
                ? localStorage.setItem("AdminDetails", JSON.stringify(data.user))
                : localStorage.setItem("UserDetails", JSON.stringify(data.user));
            role === "admin" ? window.location.href = "/dashboard" : window.location.href = "/products";
        } catch (error) {
            setMessage(error.response?.data?.error || "Login failed.");
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5"
        }}>
            <div style={{
                maxWidth: "400px",
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center"
            }}>
                <h1 style={{ marginBottom: "20px", color: "#333" }}>Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        fontSize: "14px"
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        fontSize: "14px"
                    }}
                />
                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#28A745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: "pointer",
                        marginBottom: "15px"
                    }}
                >
                    Login
                </button>
                <p style={{ color: "red", marginBottom: "15px" }}>{message}</p>
                <div>
                    <p style={{ marginBottom: "10px", color: "#555" }}>
                        Don't have an account? <a href="/register-user" style={{ color: "#007BFF", textDecoration: "none" }}>Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
