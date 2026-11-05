
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    movementType: {
      type: String,
      enum: ["Stock In", "Stock Out"],
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    previousStock: {
      type: Number,
      required: true
    },

    newStock: {
      type: Number,
      required: true
    },

    reason: {
      type: String,
      default: ""
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
