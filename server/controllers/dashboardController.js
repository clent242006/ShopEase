const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();

    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalSales = sales.length > 0 ? sales[0].total : 0;

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending"
    });

    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 10 }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCustomers,
        totalOrders,
        totalSales,
        pendingOrders,
        lowStockProducts
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getDashboardStats };