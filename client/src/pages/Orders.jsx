
import { useState, useEffect } from "react";
import { Search, Trash2, ShoppingBag, RefreshCw } from "lucide-react";
import API from "../services/api";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPeso = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
    }).format(amount || 0);
  };

  const updateOrderStatus = async (order, field, value) => {
    try {
      await API.put(`/orders/${order._id}`, {
        paymentStatus: field === "paymentStatus"
          ? value
          : order.paymentStatus,
        orderStatus: field === "orderStatus"
          ? value
          : order.orderStatus
      });

      alert("Order status updated successfully!");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order.");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm(
      "Are you sure you want to delete this order? Product stock will be restored."
    )) {
      return;
    }

    try {
      await API.delete(`/orders/${id}`);
      alert("Order deleted successfully!");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete order.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer
      ? `${order.customer.firstname} ${order.customer.lastname}`
      : "";

    return (
      order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Order Management</h1>
          <p>Monitor and manage customer orders.</p>
        </div>

        <button className="orders-refresh-btn" onClick={fetchOrders}>
          <RefreshCw size={17} />
          Refresh Orders
        </button>
      </div>

      <div className="orders-summary">
        <div className="orders-summary-card">
          <ShoppingBag size={22} />
          <div>
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="orders-summary-card">
          <ShoppingBag size={22} />
          <div>
            <h3>{orders.filter(o => o.orderStatus === "Pending").length}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="orders-summary-card">
          <ShoppingBag size={22} />
          <div>
            <h3>{orders.filter(o => o.paymentStatus === "Paid").length}</h3>
            <p>Paid Orders</p>
          </div>
        </div>
      </div>

      <div className="orders-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search order number or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>

                  <td>
                    {order.customer
                      ? `${order.customer.firstname} ${order.customer.lastname}`
                      : "Unknown Customer"}
                  </td>

                  <td>
                    {order.items?.map((item, index) => (
                      <div key={index}>
                        {item.product?.name || "Product"} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="order-amount">
                    {formatPeso(order.totalAmount)}
                  </td>

                  <td>
                    <select
                      className="order-select"
                      value={order.paymentStatus}
                      onChange={(e) =>
                        updateOrderStatus(order, "paymentStatus", e.target.value)
                      }
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>

                  <td>
                    <select
                      className="order-select"
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(order, "orderStatus", e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-PH")}
                  </td>

                  <td>
                    <button
                      className="order-delete-btn"
                      onClick={() => deleteOrder(order._id)}
                      title="Delete order"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="orders-empty">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
