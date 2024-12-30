import axios from "axios";

const API_URL = "http://localhost:5000/api/products";
const PAYMENT_URL = "http://localhost:5000/api/payment"
const AUTH_URL = "http://localhost:5000/api/auth"

// Fetch all products
export const getProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Add a new product
export const addProduct = async (productData) => {
    const response = await axios.post(API_URL, productData);
    return response;
};

// Delete a product
export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// Create Stripe payment intent
export const createPaymentIntent = async (productId) => {
    const response = await axios.post(`${PAYMENT_URL}/create-payment-intent`, { productId });
    return response.data;
};

// Update product purchase status
export const updatePurchaseStatus = async (id) => {
    const response = await axios.put(`${PAYMENT_URL}/purchase/${id}`);
    return response.data;
};

export const createStripeAccount = async (userId) => {
    const response = await axios.post(`${AUTH_URL}/create-stripe-account`, { userId });
    return response.data;
};

export const getStripeStatus = async (userId) => {
    const response = await axios.get(`${AUTH_URL}/stripe-status/${userId}`);
    return response.data;
};

export const verifyStripeConnection = async (stripeAccountId) => {
    const response = await axios.post(`${AUTH_URL}/verify-stripe-status`, { stripeAccountId });
    return response.data;
};