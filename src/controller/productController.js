const Product = require("../model/productModel")



const createProduct = async (req, res) => {
    const { title, description, weight_in_grams, price, brand, model } = req.body;
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

module.exports = { createProduct }