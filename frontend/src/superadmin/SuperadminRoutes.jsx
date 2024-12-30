import React from "react";
import { Route, Routes, Navigate, Router } from "react-router-dom";
import SuperadminDashboard from "./SuperadminDashboard";

// A mock function to check if the user is superadmin
const isSuperadmin = (user) => {
    return user?.role === "superadmin";
};

const SuperadminRoutes = ({ user }) => {
    if (!isSuperadmin(user)) {
        return <Navigate to="/login" replace />;
    }

    return (
        // <Routes>
        <div>
            <h1>Superadmin Dashboard</h1>
            <Routes>
                <Route path="/dashboard" element={<SuperadminDashboard />} />
            </Routes>
        </div>
        // </Routes>
    );
};

export default SuperadminRoutes;
