import React from "react";

function ProductTable({ products, onUpdateStatus, onDelete }) {
    return (
        <table className="min-w-full bg-white rounded-md overflow-hidden shadow-md">
            <thead>
                <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left text-sm text-gray-600">Product Name</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-600">Price</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-600">Supplier</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-600">Purchased</th>
                    <th className="px-4 py-2 text-center text-sm text-gray-600">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product._id} className="border-t">
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">${product.price}</td>
                        <td className="px-4 py-2">{product.supplier}</td>
                        <td className="px-4 py-2">{product.purchased ? "Yes" : "No"}</td>
                        <td className="px-4 py-2 text-center space-x-2">
                            {!product.purchased && (
                                <button
                                    onClick={() => onUpdateStatus(product._id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Mark as Purchased
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(product._id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ProductTable;
