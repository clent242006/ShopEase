
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

// STOCK IN / STOCK OUT
const updateInventory = async (req, res) => {
  try {
    const { productId, movementType, quantity, reason } = req.body;

    // Validate required fields
    if (!productId || !movementType || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    if (!["Stock In", "Stock Out"].includes(movementType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movement type."
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number."
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    // Calculate new stock
    if (movementType === "Stock In") {
      newStock += quantity;
    } else {
      if (quantity > previousStock) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available."
        });
      }

      newStock -= quantity;
    }

    // Update product stock
    product.stock = newStock;
    await product.save();

    // Record inventory movement
    const inventory = await Inventory.create({
      product: product._id,
      movementType,
      quantity,
      previousStock,
      newStock,
      reason: reason || "",
      performedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Inventory updated successfully.",
      inventory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET INVENTORY HISTORY
const getInventoryHistory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate("product", "name sku stock")
      .populate("performedBy", "firstname lastname email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inventory.length,
      inventory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET LOW STOCK PRODUCTS
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $lte: 10 }
    }).sort({ stock: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  updateInventory,
  getInventoryHistory,
  getLowStockProducts
};
