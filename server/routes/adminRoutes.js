const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");

// Get all staff members
router.get("/staff", protect, authorize("admin"), async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: staff.length,
      staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// Create a new staff member
router.post("/staff", protect, authorize("admin"), async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters."
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: "staff"
    });

    res.status(201).json({
      success: true,
      message: "Staff account created successfully.",
      staff: {
        _id: staff._id,
        firstname: staff.firstname,
        lastname: staff.lastname,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// Update staff information
router.put("/staff/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;

    const staff = await User.findOneAndUpdate(
      { _id: req.params.id, role: "staff" },
      { firstname, lastname, email },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff updated successfully.",
      staff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete a staff member
router.delete("/staff/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const staff = await User.findOneAndDelete({
      _id: req.params.id,
      role: "staff"
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
