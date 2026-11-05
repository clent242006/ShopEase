
const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/ProductController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// All product routes require a logged-in Admin or Staff
router.use(protect, authorize("admin", "staff"));

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
