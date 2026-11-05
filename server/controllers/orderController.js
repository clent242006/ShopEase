
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      paymentMethod,
      shippingAddress
    } = req.body;

    if (!customer || !items || items.length === 0 ||
        !paymentMethod || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Please complete all order fields."
      });
    }

    // Check if customer exists
    const existingCustomer = await Customer.findById(customer);

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found."
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate products and calculate total
    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Product quantity must be at least 1."
        });
      }

      const product = await Product.findById(item.product);

      if (!product || product.status !== "Active") {
        return res.status(404).json({
          success: false,
          message: "Product not found or inactive."
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}.`
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order number
    const orderNumber = "ORD-" + Date.now();

    // Save order
    const order = await Order.create({
      orderNumber,
      customer,
      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress
    });

    // Deduct product stocks
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// READ ALL ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "firstname lastname email")
      .populate("items.product", "name sku price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// READ ONE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "firstname lastname email")
      .populate("items.product", "name sku price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid order ID."
    });
  }
};

// UPDATE ORDER
const updateOrder = async (req, res) => {
  try {
    const { paymentStatus, orderStatus } = req.body;

    const allowedPayment = ["Unpaid", "Paid", "Refunded"];
    const allowedStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    if (
      !allowedPayment.includes(paymentStatus) ||
      !allowedStatus.includes(orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment or order status."
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, orderStatus },
      { returnDocument: "after", runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    // Restore product stocks when deleting an order
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted and product stocks restored."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};
