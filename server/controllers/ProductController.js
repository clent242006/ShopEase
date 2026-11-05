
const Product = require("../models/Product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      sku,
      category,
      price,
      stock,
      imageUrl
    } = req.body;

    if (!name || !sku || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required product fields."
      });
    }

    if (
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid price and whole-number stock quantity."
      });
    }

    const existingProduct = await Product.findOne({
      sku: sku.trim().toUpperCase()
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this SKU already exists."
      });
    }

    const product = await Product.create({
      name,
      description,
      sku,
      category,
      price: Number(price),
      stock: Number(stock),
      imageUrl
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

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

// GET ONE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID."
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.price !== undefined) {
      if (!Number.isFinite(Number(updates.price)) || Number(updates.price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid product price."
        });
      }

      updates.price = Number(updates.price);
    }

    if (updates.stock !== undefined) {
      if (!Number.isInteger(Number(updates.stock)) || Number(updates.stock) < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a whole number of zero or more."
        });
      }

      updates.stock = Number(updates.stock);
    }

    if (updates.sku) {
      updates.sku = updates.sku.trim().toUpperCase();

      const duplicate = await Product.findOne({
        sku: updates.sku,
        _id: { $ne: req.params.id }
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another product already uses this SKU."
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: "after", runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!"
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID."
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
