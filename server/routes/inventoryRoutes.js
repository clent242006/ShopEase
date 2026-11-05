
const express = require("express");
const router = express.Router();

const {
  updateInventory,
  getInventoryHistory,
  getLowStockProducts
} = require("../controllers/inventoryController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Protect all inventory routes
router.use(protect, authorize("admin", "staff"));

// STOCK IN / STOCK OUT
router.post("/update", updateInventory);

// VIEW INVENTORY HISTORY
router.get("/history", getInventoryHistory);

// VIEW LOW STOCK PRODUCTS
router.get("/low-stock", getLowStockProducts);

module.exports = router;
