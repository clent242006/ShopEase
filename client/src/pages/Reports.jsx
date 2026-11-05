
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { FileText, ShoppingCart, Users, PhilippinePeso } from "lucide-react";
import API from "../services/api";
import "./Reports.css";

function Reports() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [orderRes, customerRes, productRes] = await Promise.all([
        API.get("/orders"),
        API.get("/customers"),
        API.get("/products")
      ]);

      setOrders(orderRes.data.orders || []);
      setCustomers(customerRes.data.customers || []);
      setProducts(productRes.data.products || []);
    } catch (error) {
      console.error("Reports error:", error);
    } finally {
      setLoading(false);
    }
  };

  const peso = (amount) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
    }).format(amount || 0);

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "Paid"
  );

  const totalSales = paidOrders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );

  const unpaidOrders = orders.filter(
    (order) => order.paymentStatus === "Unpaid"
  );

  const chartData = paidOrders.reduce((result, order) => {
    const date = new Date(order.createdAt).toLocaleDateString("en-PH");

    const existing = result.find((item) => item.date === date);

    if (existing) {
      existing.sales += order.totalAmount;
    } else {
      result.push({ date, sales: order.totalAmount });
    }

    return result;
  }, []);

  const productSales = {};

  orders.forEach((order) => {
    order.items?.forEach((item) => {
      if (item.product) {
        const name = item.product.name;
        productSales[name] =
          (productSales[name] || 0) + item.quantity;
      }
    });
  });

  const bestSelling = Object.entries(productSales)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  if (loading) {
    return <div className="reports-page">Loading reports...</div>;
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>View your ShopEase business performance.</p>
        </div>
        <button onClick={fetchReports}>
          <FileText size={17} />
          Refresh Reports
        </button>
      </div>

      <div className="reports-stats">
        <div className="report-stat">
          <PhilippinePeso size={25} />
          <p>Total Sales</p>
          <h2>{peso(totalSales)}</h2>
        </div>

        <div className="report-stat">
          <ShoppingCart size={25} />
          <p>Total Orders</p>
          <h2>{orders.length}</h2>
        </div>

        <div className="report-stat">
          <Users size={25} />
          <p>Total Customers</p>
          <h2>{customers.length}</h2>
        </div>

        <div className="report-stat">
          <FileText size={25} />
          <p>Unpaid Orders</p>
          <h2>{unpaidOrders.length}</h2>
        </div>
      </div>

      <div className="reports-card">
        <h2>Sales Performance</h2>

        {chartData.length === 0 ? (
          <p>No paid sales data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26364d" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                formatter={(value) => peso(value)}
                contentStyle={{
                  background: "#111c32",
                  border: "1px solid #38bdf8",
                  color: "#fff"
                }}
              />
              <Bar dataKey="sales" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="reports-card">
        <h2>Best-Selling Products</h2>

        {bestSelling.length === 0 ? (
          <p>No product sales data available yet.</p>
        ) : (
          <div className="reports-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {bestSelling.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="reports-card">
        <h2>Product Inventory Summary</h2>

        <div className="reports-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Available Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{peso(product.price)}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
