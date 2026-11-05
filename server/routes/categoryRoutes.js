
const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Protect all category routes
router.use(protect, authorize("admin", "staff"));

// CREATE
router.post("/", createCategory);

// READ ALL
router.get("/", getCategories);

// READ ONE
router.get("/:id", getCategoryById);

// UPDATE
router.put("/:id", updateCategory);

// DELETE
router.delete("/:id", deleteCategory);

module.exports = router;
