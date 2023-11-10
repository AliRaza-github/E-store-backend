const Product = require("../model/productModel");
const { createProductSchema } = require("../utils/joiSchema");


const createProduct = async (req, res) => {
    const { title, description, weight_in_grams, price, brand, model } = req.body;
    const { error, value } = createProductSchema.validate(req.body, { abortEarly: false });
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

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    console.log("id",id)
    try {
        // Assuming you have a 'Product' model with a 'findByIdAndDelete' method
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found", data: null, message: "Product not found" });
        }

        return res.status(200).json({ error: null, data: deletedProduct, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in deleting product" });
    }
};

module.exports = { createProduct ,deleteProduct}