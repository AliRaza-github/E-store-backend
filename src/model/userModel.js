const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    email_verify_token: {
        type: String,
    }
}
    , { timestamps: true }
)

module.exports = mongoose.model("user", userSchema)