const express = require("express");
const router = express.Router();
const { createProduct ,deleteProduct } = require("../controller/productController");

router.post("/create", createProduct);
router.delete("/:id", deleteProduct);

module.exports = router