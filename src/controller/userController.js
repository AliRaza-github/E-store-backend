require("dotenv").config()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const { registerSchema ,loginSchema } = require("../utils/joiSchema")
const salt = parseInt(process.env.SALT);
const jwtSecret = process.env.JWT_SECRET;


const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, data: null, message: "Validation error" });
    }
    try {
        const userData = await User.findOne({ email: email }).select({ email: 1 })
        if (userData) {
            return res.status(400).json({ error: "Email already exist", data: null, message: "Email already exist" });
        }

        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashPassword,
        });
        const savedUser = await user.save();

        return res.status(200).json({ error: null, data: savedUser, message: "User saved successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in Registration " })
    };
};


const login = async (req, res) => {
    const { email, password } = req.body;
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, data: null, message: "Validation error" });
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password", data: null, message: "Invalid email or password" });
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(401).json({ error: "Invalid email or password", data: null, message: "Invalid email or password" });
        }


        const token = jwt.sign(
            { email: user.email, id: user._id },
            jwtSecret
        );
        const userData = user.toObject();
        delete userData.password;
        const data = {
            user: userData,
            jwt: token,
        }
        return res.status(200).json({
            error: null,
            data: data,
            message: "Successfully login"
        });

    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in login" })
    }
}

module.exports = { register, login }