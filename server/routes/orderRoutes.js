
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require("../controllers/orderController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Protect all order routes
router.use(protect, authorize("admin", "staff"));

// CREATE ORDER
router.post("/", createOrder);

// READ ALL ORDERS
router.get("/", getOrders);

// READ ONE ORDER
router.get("/:id", getOrderById);

// UPDATE ORDER
router.put("/:id", updateOrder);

// DELETE ORDER
router.delete("/:id", deleteOrder);

module.exports = router;
