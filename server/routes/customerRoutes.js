
const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Protect all customer routes
router.use(protect, authorize("admin", "staff"));

// CREATE
router.post("/", createCustomer);

// READ ALL
router.get("/", getCustomers);

// READ ONE
router.get("/:id", getCustomerById);

// UPDATE
router.put("/:id", updateCustomer);

// DELETE
router.delete("/:id", deleteCustomer);

module.exports = router;
