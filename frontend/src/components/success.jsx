import React from "react";

const Success = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Success!</h1>
            <p>Your operation was completed successfully.</p>
            <a href="/dashboard">
                <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
                    Go to Dashboard
                </button>
            </a>
        </div>
    );
};

export default Success;
