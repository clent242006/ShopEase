
const Customer = require("../models/Customer");

// CREATE CUSTOMER
const createCustomer = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, address } = req.body;

    if (!firstname || !lastname || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Please complete all customer fields."
      });
    }

    const existingCustomer = await Customer.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered."
      });
    }

    const customer = await Customer.create({
      firstname,
      lastname,
      email,
      phone,
      address
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// READ ALL CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// READ ONE CUSTOMER
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found."
      });
    }

    res.status(200).json({
      success: true,
      customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid customer ID."
    });
  }
};

// UPDATE CUSTOMER
const updateCustomer = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, address } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, email, phone, address },
     { returnDocument: "after", runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000
        ? "Email is already registered."
        : error.message
    });
  }
};

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully."
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid customer ID."
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
