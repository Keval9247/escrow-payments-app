import React from "react";

const Reauth = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Reauthenticate</h1>
            <p>Your session has expired or failed. Please try again.</p>
            <a href="/">
                <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
                    Restart Onboarding
                </button>
            </a>
        </div>
    );
};

export default Reauth;
