const express = require("express");
const router = express.Router();
const { register, login, resetPasswordRequest ,resetPassword,activateUser} = require("../controller/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/user-activation/:id/:token", activateUser);
router.post("/reset-password-request", resetPasswordRequest);
router.post("/reset-password/:id", resetPassword);

module.exports = router