
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("Admin credentials are missing from .env");
    }

    if (process.env.ADMIN_PASSWORD.length < 8) {
      throw new Error("Password must have at least 8 characters.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("An Admin account already exists.");
      return;
    }

    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("This email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await User.create({
      firstname: "ShopEase",
      lastname: "Administrator",
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created successfully!");
    console.log("Email:", email);

  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
