const express = require("express");
const router = express.Router();
const { createProduct, deleteProduct, singleProduct, getAllProduct, updateProduct } = require("../controller/productController");
const { authMiddleware } = require("../utils/authMiddleware");

router.post("/", authMiddleware, createProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/:id", singleProduct);
router.get("/", getAllProduct);
router.put("/:id", updateProduct);

module.exports = router