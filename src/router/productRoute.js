const express = require("express");
const router = express.Router();
const { createProduct, deleteProduct, getSingleProduct, getAllProduct, updateProduct } = require("../controller/productController");
const { authMiddleware } = require("../utils/authMiddleware");

router.post("/", authMiddleware, createProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/:id", authMiddleware, getSingleProduct);
router.get("/", authMiddleware, getAllProduct);
router.put("/:id", authMiddleware, updateProduct);

module.exports = router