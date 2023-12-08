const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../utils/authMiddleware")
const { userProfileUpdate, uploadProfileImage } = require("../controller/userController");

router.post("/user-profile-update/:id", userProfileUpdate);
router.post("/user-profile-image", authMiddleware, uploadProfileImage);


module.exports = router

