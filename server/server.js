const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const { protect, authorize } = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to ShopEase API!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ShopEase API is running!",
    database: "MongoDB",
    currency: "PHP"
  });
});



// Test Admin access
app.get(
  "/api/admin/dashboard",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to the Admin Dashboard!",
      user: req.user.firstname,
      role: req.user.role
    });
  }
);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT || 5001, () => {
      console.log("ShopEase Server running on port 5001");
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();