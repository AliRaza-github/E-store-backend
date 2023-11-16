const Product = require("../model/productModel");
const { productSchema } = require("../utils/joiSchema");


const createProduct = async (req, res) => {
    const { title, description, weight_in_grams, price, brand, model } = req.body;
    const { error, value } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.message, data: null, message: "Validation error" });
    }
    try {

        const product = new Product({
            title: title,
            description: description,
            weight_in_grams: weight_in_grams,
            price: price,
            brand: brand,
            model: model
        });
        const savedProduct = await product.save();
        return res.status(200).json({ error: null, data: savedProduct, message: "product saved successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in saving product " });
    };
};

const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found", data: null, message: "Product not found" });
        }
        return res.status(200).json({ error: null, data: product, message: "Product found successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Product not found" });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ error: null, data: products, message: "Products retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in retrieving products" });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found", data: null, message: "Product not found" });
        }

        return res.status(200).json({ error: null, data: deletedProduct, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in deleting product" });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, weight_in_grams, price, brand, model } = req.body;
    const { error, value } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.message, data: null, message: "Validation error" });
    }
    try {
        const updateProduct = await Product.findByIdAndUpdate(id, {
            title: title,
            description: description,
            weight_in_grams: weight_in_grams,
            price: price,
            brand: brand,
            model: model,
        },
            { new: true });

        if (!updateProduct) {
            return res.status(404).json({ error: "Product not found", data: null, message: "Product not found" });
        };
        return res.status(404).json({ error: "Product update successfully", data: null, message: "Product update successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in updating product" });
    }
}

module.exports = { createProduct, deleteProduct, getSingleProduct, getAllProduct, updateProduct }