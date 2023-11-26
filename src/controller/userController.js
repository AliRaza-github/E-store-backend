require("dotenv").config()
const multer = require('multer');
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const User = require("../model/userModel");
const { sendAccVerificationEmail, resetPasswordEmail } = require("../utils/utilMalier");
const { registerSchema, loginSchema, resetPasswordSchema } = require("../utils/joiSchema");
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

    try {
        const userData = await User.findByIdAndUpdate({ _id: id }, {
            state: state,
            city: city,
            zip_code: zip_code,
            address: address
        }, { new: true });

        return res.status(200).json({ error: null, data: userData, message: "Profile update successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in profile update" })
    }
};

const uploadProfileImage = async (req, res) => {
    const userId = req.decoded.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: null, data: null, message: "User not found" });
        }

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
        upload(req, res, async function (err) {
            if (err) {
                return res.status(500).json({ error: err.message || err, data: null, message: "Failed to upload profile image" });
            };
            const imageName = req.file.path.replace(/^.*[\\\/]/, "");
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profile_image: imageName },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(500).json({ error: "User not found", data: null, message: "User not found" });
            }
        });
        const oldProfileImage = user.profile_image;
        if (oldProfileImage) {
            const filePath = path.join(__dirname, '../assets', oldProfileImage);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Failed to delete old profile image:", err);
                }
            });
        };
        return res.status(200).json({ error: null, data: null, message: "Profile image uploaded successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Failed to upload profile image" });
    }
};

const resetPasswordRequest = async (req, res) => {
    const { email } = req.body
    try {
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ error: "Email not found", data: null, message: "Email not found" });
        }

        const resetPasswordEmailLink = `${baseUrl}frontend-reset-url?id=${userData._id}&token=${userData.email_verify_token}`;
        const result = await resetPasswordEmail(userData.email, resetPasswordEmailLink);
        if (result) {
            return res.status(200).json({
                error: null,
                data: null,
                message: "Password reset link sent successfully. Please check your email for further instructions"
            });

        } else {
            return res.status(400).json({
                error: "Error in sending password reset link",
                data: null,
                message: "Error in sending password reset link"
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in sending email" });
    };
};

const resetPassword = async (req, res) => {
    const { id } = req.params;
    const password = req.body.password;
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message, data: null, message: "Validation error" });
    }
    try {
        const user = await User.findOne({
            _id: id,
        });
        if (!user) {
            return res.status(404).json({ error: "User not found", data: null, message: "User not found" });
        }
        const hashPassword = await bcrypt.hash(password, salt);
        user.password = hashPassword;
        await user.save();
        return res.status(200).json({ error: null, data: null, message: "Password reset successfully. You can now log in with your new password" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Error in reset password" });
    }
};

module.exports = { register, login, resetPasswordRequest, resetPassword, uploadProfileImage, userProfileUpdate }

