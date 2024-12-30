import React, { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import { deleteProduct, getProducts, updatePurchaseStatus } from "../api/api";
import StripeStatus from "./stripe/StripeStatus";

function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            setMessage("Failed to fetch products.");
        }
    };

    const handleUpdateStatus = async (id) => {
        try {
            await updatePurchaseStatus(id);
            setMessage("Product purchase status updated.");
            fetchProducts();
        } catch (error) {
            setMessage("Failed to update product status.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            setMessage("Product deleted successfully.");
            fetchProducts();
        } catch (error) {
            setMessage("Failed to delete product.");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Manage Products</h2>
            {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
            <ProductTable
                products={products}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
            />
            <StripeStatus userId={products.supplierId} />
        </div>
    );
}

export default ManageProducts;
