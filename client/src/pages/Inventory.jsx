
import { useEffect, useState } from "react";
import { Package, RefreshCw, AlertTriangle } from "lucide-react";
import API from "../services/api";
import "./Inventory.css";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    productId: "",
    movementType: "Stock In",
    quantity: "",
    reason: ""
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const [productRes, historyRes, lowStockRes] = await Promise.all([
        API.get("/products"),
        API.get("/inventory/history"),
        API.get("/inventory/low-stock")
      ]);

      setProducts(productRes.data.products || []);
      setHistory(historyRes.data.history || []);
      setLowStock(lowStockRes.data.products || []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load inventory data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/inventory/update", {
        ...form,
        quantity: Number(form.quantity)
      });

      setMessage("Inventory updated successfully!");

      setForm({
        productId: "",
        movementType: "Stock In",
        quantity: "",
        reason: ""
      });

      fetchInventory();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update inventory."
      );
    }
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Monitor and manage your product stock.</p>
        </div>

        <button onClick={fetchInventory} className="inventory-refresh">
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {message && <div className="inventory-message">{message}</div>}

      <div className="inventory-card">
        <h2><Package size={20} /> Update Stock</h2>

        <form onSubmit={handleSubmit}>
          <label>Select Product</label>
          <select
            value={form.productId}
            onChange={(e) =>
              setForm({ ...form, productId: e.target.value })
            }
            required
          >
            <option value="">Choose a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} — Current Stock: {product.stock}
              </option>
            ))}
          </select>

          <label>Movement Type</label>
          <select
            value={form.movementType}
            onChange={(e) =>
              setForm({ ...form, movementType: e.target.value })
            }
          >
            <option value="Stock In">Stock In</option>
            <option value="Stock Out">Stock Out</option>
          </select>

          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
            placeholder="Enter quantity"
            required
          />

          <label>Reason</label>
          <input
            type="text"
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
            }
            placeholder="Example: New delivery"
            required
          />

          <button type="submit">Update Inventory</button>
        </form>
      </div>

      <div className="inventory-card">
        <h2><AlertTriangle size={20} /> Low Stock Products</h2>

        {lowStock.length === 0 ? (
          <p>No low-stock products found.</p>
        ) : (
          <div className="inventory-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Current Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="inventory-card">
        <h2>Inventory Movement History</h2>

        {loading ? (
          <p>Loading inventory...</p>
        ) : history.length === 0 ? (
          <p>No inventory movements found.</p>
        ) : (
          <div className="inventory-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Movement</th>
                  <th>Quantity</th>
                  <th>Previous Stock</th>
                  <th>New Stock</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>{item.product?.name || "Deleted Product"}</td>
                    <td>{item.movementType}</td>
                    <td>{item.quantity}</td>
                    <td>{item.previousStock}</td>
                    <td>{item.newStock}</td>
                    <td>{item.reason}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
