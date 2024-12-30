import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [allUser, setAllUser] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [users, setUsers] = useState([]);

    const products = [
        { id: 1, name: "Product A", price: "$100", seller: "Seller One" },
        { id: 2, name: "Product B", price: "$150", seller: "Seller Two" },
    ];

    const navigate = useNavigate();

    // Fetch all users from API
    const fetchAllUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/readAll');
            setAllUser(response.data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    // Separate users into sellers and regular users
    useEffect(() => {
        fetchAllUser();
    }, []);

    useEffect(() => {
        if (allUser.length > 0) {
            const sellersList = [];
            const usersList = [];

            allUser.forEach((user) => {
                if (user.role === "admin") {
                    sellersList.push(user);
                } else if (user.role === "user") {
                    usersList.push(user);
                }
            });

            setSellers(sellersList);
            setUsers(usersList);
        }
    }, [allUser]);

    const renderTable = (data, columns) => (
        <table className="min-w-full bg-white border rounded-lg">
            <thead>
                <tr className="bg-gray-100 text-left">
                    {columns.map((col) => (
                        <th key={col.key} className="py-3 px-6 font-medium text-gray-600">{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => (
                    <tr key={idx} className="border-t">
                        {columns.map((col) => (
                            <td key={col.key} className="py-3 px-6">{item[col.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center py-5 w-[45%]">
                <h1 className="text-4xl font-bold text-gray-800">Main Dashboard</h1>
                <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
            </div>

            {/* Registration Section */}
            <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">Registration Options</h2>
                    <span className="text-gray-700 font-medium">Register As A:</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <p className="text-gray-600">
                        Register as a seller to list products, or register as a user to explore and purchase products.
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/register-seller')}
                            className="bg-indigo-500 text-white rounded-xl px-5 py-3 hover:bg-indigo-700 transition transform"
                        >
                            Seller
                        </button>
                        <button
                            onClick={() => navigate('/register-user')}
                            className="bg-green-500 text-white rounded-xl px-5 py-3 hover:bg-green-700 transition transform"
                        >
                            User
                        </button>
                    </div>
                </div>
            </div>

            {/* Sellers Section */}
            <div className="bg-white shadow-md rounded-lg w-full max-w-5xl p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Registered Sellers</h2>
                <div className="overflow-x-auto">
                    {renderTable(sellers, [
                        { key: "name", header: "Seller Name" },
                        { key: "email", header: "Email" },
                    ])}
                </div>
            </div>

            {/* Users Section */}
            <div className="bg-white shadow-md rounded-lg w-full max-w-5xl p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Registered Users</h2>
                <div className="overflow-x-auto">
                    {renderTable(users, [
                        { key: "name", header: "User Name" },
                        { key: "email", header: "Email" },
                    ])}
                </div>
            </div>

            {/* Products Section */}
            <div className="bg-white shadow-md rounded-lg w-full max-w-5xl p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Available Products [Dummy Products]</h2>
                <div className="overflow-x-auto">
                    {renderTable(products, [
                        { key: "name", header: "Product Name" },
                        { key: "price", header: "Price" },
                        { key: "seller", header: "Seller" },
                    ])}
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center text-gray-600 text-sm">
                © {new Date().getFullYear()} Platform. All rights reserved.
            </footer>
        </div>
    );
};

export default Dashboard;
