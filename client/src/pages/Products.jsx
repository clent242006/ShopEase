
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package
} from "lucide-react";

import "./Products.css";

import API from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "",
    status: "Active"
  });

  const [editingId, setEditingId] = useState(null);

  const formatPeso = (amount) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
    }).format(amount);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
      imageUrl: "",
      status: "Active"
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, productData);
        alert("Product updated successfully!");
      } else {
        await API.post("/products", productData);
        alert("Product added successfully!");
      }

      resetForm();
      fetchProducts();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong."
      );
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      description: product.description || "",
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || "",
      status: product.status
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await API.delete(`/products/${id}`);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to delete product."
      );
    }
  };

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.sku} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="products-heading">
        <div>
          <h1>Products Management</h1>
          <p>Manage your store products and inventory.</p>
        </div>

        <span className="products-count">
          {products.length} Products
        </span>
      </div>

      <div className="product-form-panel">
        <h3>
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="product-form-grid">
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="sku"
              placeholder="SKU"
              value={form.sku}
              onChange={handleChange}
              required
            />

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />

            <input
              name="price"
              type="number"
              placeholder="Price (₱)"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock Quantity"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              required
            />

            <input
              name="imageUrl"
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={handleChange}
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <input
              name="description"
              placeholder="Product Description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="product-form-actions">
            <button type="submit" className="product-save-button">
              <Plus size={17} />
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="product-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="product-list-panel">
        <div className="product-list-header">
          <div>
            <h3>Product List</h3>
            <p>All registered products</p>
          </div>

          <div className="product-search">
            <Search size={17} />
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="product-message">Loading products...</p>
        ) : (
          <div className="product-table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>SKU</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{formatPeso(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`product-status ${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="product-edit-button"
                        onClick={() => handleEdit(product)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        className="product-delete-button"
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="product-message">
                      <Package size={25} />
                      <p>No products found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
