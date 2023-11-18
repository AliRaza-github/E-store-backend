require("dotenv").config()
const multer = require('multer');
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const User = require("../model/userModel");
const { sendAccVerificationEmail } = require("../utils/utilMalier");
const { registerSchema, loginSchema } = require("../utils/joiSchema");
const salt = parseInt(process.env.SALT);
const jwtSecret = process.env.JWT_SECRET;
const baseUrl = process.env.BASE_URL;

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

        const token = crypto.randomBytes(16).toString("hex");
        const hashPassword = await bcrypt.hash(password, salt);
        const user = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashPassword,
            email_verify_token: token,
        });
        const savedUser = await user.save();
        const link = `${baseUrl}api/users/verify-email/${savedUser._id}`;
        const result = sendAccVerificationEmail(savedUser.email, link)

        if (result) {
            return res.status(200).json({ error: null, data: null, message: "Verification email sent successfully" });
        } else {
            return res.status(400).json({
                error: "Error in sending verification email",
                data: null,
                message: "Error in sending verification email"
            });
        };
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in registration" });
    }
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
};

const userProfileUpdate = async (req, res) => {
    const { id } = req.params;
    const { state, city, zip_code, address } = req.body;
    console.log("log0")
    try {
        console.log("log1")
        const userData = await User.findByIdAndUpdate({ _id: id }, {
            state: state,
            city: city,
            zip_code: zip_code,
            address: address
        }, { new: true });

        console.log("log2", userData)
        return res.status(200).json({ error: null, data: userData, message: "Profile update successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in profile update" })
    }
};
/////////////////////

const uploadProfileImage = async (req, res) => {
    const { id } = req.decoded.id;
    
    try {
        
        const fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                const destination = path.join(__dirname, "../assets");
                cb(null, destination);
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + "--" + file.originalname);
            },
        });

        const upload = multer({ storage: fileStorage }).single("image");
        upload(req, res, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message || err, data: null, message: "Failed to upload profile image" });
            }
            return res.status(200).json({ error: null, data: null, message: "Profile image uploaded successfully" });
        });

    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Failed to upload profile image" });
    }
};







module.exports = { register, login, userProfileUpdate, uploadProfileImage }