const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    weight_in_grams: {
        type: Number
    },
    price: {
        type: Number
    },
    brand: {
        type: String
    },
    model: {
        type: Number
    },

},
    { timestamps: true }
)

module.exports = mongoose.model("product", productSchema)