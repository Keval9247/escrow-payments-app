const ProductModel = require('../models/Product.model.js');
const Product = require('../models/Product.model.js');
const UserModel = require('../models/User.model.js');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("sellerId", "name email stripeAccountId");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

exports.getProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await ProductModel.findById(productId).populate('adminId', 'name email');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
};

exports.getProductByUserID = async (req, res) => {
    const { userId } = req.params;
    try {
        const products = await ProductModel.find({ sellerId: userId });
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products." });
    }
}

exports.addProduct = async (req, res) => {
    const { name, price, description, supplierId } = req.body;

    try {
        const newProduct = new Product({ name, price, description, sellerId: supplierId });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: "Failed to add product" });
    }
};

exports.getSupplierdetails = async (req, res) => {
    try {
        const products = await Product.find({ supplier: req.params.supplier });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products for the supplier" });
    }
}

exports.updateProducts = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Failed to update product" });
    }
}

exports.getProductsBySellerId = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.sellerId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products for the seller" });
    }
}

