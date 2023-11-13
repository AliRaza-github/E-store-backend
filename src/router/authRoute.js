const express = require("express");
const router = express.Router();
const { register, login, resetPasswordRequest } = require("../controller/userController");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password-request", resetPasswordRequest);

module.exports = router