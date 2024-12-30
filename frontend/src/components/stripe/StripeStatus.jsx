import React, { useEffect, useState } from "react";
import { getStripeStatus } from "../../api/api";

function StripeStatus({ userId }) {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            const { isStripeConnected } = await getStripeStatus(userId);
            setIsConnected(isStripeConnected);
        };

        fetchStatus();
    }, [userId]);

    return (
        <div>
            <p className="text-sm text-gray-600">
                Stripe Connected: {isConnected ? "Yes" : "No"}
            </p>
        </div>
    );
}

export default StripeStatus;
