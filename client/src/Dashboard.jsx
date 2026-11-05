import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Warehouse,
  ChartNoAxesCombined,
  Settings,
  Bell,
  Search,
  Menu,
  ChevronDown,
  PhilippinePeso,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  CircleAlert,
  LogOut
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import API from "./services/api";

import "./App.css";

const orders = [
  {
    id: "#ORD-1001",
    customer: "John Smith",
    product: "Wireless Headphones",
    date: "Nov 04, 2026",
    amount: 2499,
    status: "Completed"
  },
  {
    id: "#ORD-1002",
    customer: "Maria Santos",
    product: "Smart Watch",
    date: "Nov 04, 2026",
    amount: 3599,
    status: "Processing"
  },
  {
    id: "#ORD-1003",
    customer: "James Wilson",
    product: "Mechanical Keyboard",
    date: "Nov 03, 2026",
    amount: 1899,
    status: "Pending"
  },
  {
    id: "#ORD-1004",
    customer: "Sarah Johnson",
    product: "Gaming Mouse",
    date: "Nov 03, 2026",
    amount: 1299,
    status: "Completed"
  },
  {
    id: "#ORD-1005",
    customer: "David Garcia",
    product: "USB-C Hub",
    date: "Nov 02, 2026",
    amount: 899,
    status: "Cancelled"
  }
];

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Products", icon: Package },
  { name: "Categories", icon: Tags },
  { name: "Orders", icon: ShoppingCart, badge: "5" },
  { name: "Customers", icon: Users },
  { name: "Inventory", icon: Warehouse },
  { name: "Reports", icon: ChartNoAxesCombined },
  { name: "Staff", icon: Users },
];

const formatPeso = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  }).format(amount);

function Dashboard() {

  const navigate = useNavigate();

  const [inventorySummary, setInventorySummary] = useState({
  total: 0,
  inStock: 0,
  lowStock: 0,
  outOfStock: 0
});

  const [dashboardStats, setDashboardStats] = useState({
  totalSales: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  pendingOrders: 0,
  lowStockProducts: 0
});


const [loadingStats, setLoadingStats] = useState(true);


const [recentOrders, setRecentOrders] = useState([]);

useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("/dashboard");

      setDashboardStats(response.data.stats);
    } catch (error) {
      console.error("Failed to load dashboard statistics:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  fetchDashboardStats();
}, []);

useEffect(() => {
  const fetchInventorySummary = async () => {
    try {
      const response = await API.get("/products");

      const products = response.data.products;

      setInventorySummary({
        total: products.length,
        inStock: products.filter(p => p.stock > 10).length,
        lowStock: products.filter(
          p => p.stock > 0 && p.stock <= 10
        ).length,
        outOfStock: products.filter(p => p.stock === 0).length
      });

    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  };

  fetchInventorySummary();
}, []);

useEffect(() => {
  const fetchRecentOrders = async () => {
    try {
      const response = await API.get("/orders");

      const orders = response.data.orders;

      setRecentOrders(orders.slice(0, 5));

      // Get the last 7 days
      const lastSevenDays = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        lastSevenDays.push({
          day: date.toLocaleDateString("en-US", {
            weekday: "short"
          }),
          date: date.toDateString(),
          sales: 0
        });
      }

      // Calculate paid sales for each day
      orders.forEach((order) => {
        if (order.paymentStatus === "Paid") {
          const orderDate = new Date(order.createdAt).toDateString();

          const dayData = lastSevenDays.find(
            (item) => item.date === orderDate
          );

          if (dayData) {
            dayData.sales += order.totalAmount;
          }
        }
      });

      setSalesData(lastSevenDays);

    } catch (error) {
      console.error("Failed to load recent orders:", error);
    }
  };

  fetchRecentOrders();
}, []);

  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);

  const filteredOrders = recentOrders.filter((order) =>
  [
    order.orderNumber,
    order.customer?.firstname,
    order.customer?.lastname,
    order.orderStatus
  ]
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  const handleLogout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  window.location.href = "/login";
};

  const stats = [
  {
    title: "Total Revenue",
    value: formatPeso(dashboardStats.totalSales),
    icon: PhilippinePeso,
    color: "blue"
  },
  {
    title: "Total Orders",
    value: dashboardStats.totalOrders,
    icon: ShoppingCart,
    color: "purple"
  },
  {
    title: "Total Products",
    value: dashboardStats.totalProducts,
    icon: Package,
    color: "orange"
  },
  {
    title: "Total Customers",
    value: dashboardStats.totalCustomers,
    icon: Users,
    color: "green"
  }
];


const totalWeeklySales = salesData.reduce(
  (total, item) => total + item.sales,
  0
);

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <div className="brand">
          <div className="brand-logo">S</div>
          <div>
            <h2>ShopEase</h2>
            <span>Business Management</span>
          </div>
        </div>

        <div className="menu-label">MAIN MENU</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
               onClick={() => {
  if (item.name === "Dashboard") {
    navigate("/dashboard");
  } else if (item.name === "Products") {
    navigate("/products");
  } else if (item.name === "Categories") {
    navigate("/categories");
  } else if (item.name === "Customers") {
    navigate("/customers");
  } else if (item.name === "Orders") {
  navigate("/orders");
  } else if (item.name === "Inventory") {
  navigate("/inventory");
  } else if (item.name === "Reports") {
  navigate("/reports");
  } else if (item.name === "Staff") {
  navigate("/staff");
  } else {
    setActivePage(item.name);
  }

  setSidebarOpen(false);
}}
              >
                <Icon size={19} />
                <span>{item.name}</span>

                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="menu-label settings-label">PREFERENCES</div>

        <button
          className={`nav-item ${
            activePage === "Settings" ? "active" : ""
          }`}
          onClick={() => setActivePage("Settings")}
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <button
  className="logout-button"
  onClick={handleLogout}
>
  Logout
</button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">?</div>
            <h4>Need help?</h4>
            <p>Contact our support team for assistance.</p>
            <button onClick={() => alert("ShopEase Support")}>
              Contact Support
            </button>
          </div>

          <div className="sidebar-user">
            <div className="avatar">AD</div>
            <div className="user-info">
              <strong>Administrator</strong>
              <span>admin@shopease.com</span>
            </div>
            <LogOut size={17} className="logout-icon" />
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} />
            </button>

            <div>
              <h2>{activePage}</h2>
              <p>Welcome back! Here's what's happening today.</p>
            </div>
          </div>

          <div className="topbar-right">

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="notification-button"
              onClick={() => alert("You have 3 notifications.")}
            >
              <Bell size={20} />
              <span></span>
            </button>

            <div className="profile">
              <div className="avatar">AD</div>
              <div className="profile-info">
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
              <ChevronDown size={16} />
            </div>

          </div>
        </header>

        {/* DASHBOARD */}
        <div className="dashboard-content">

          <div className="page-heading">
            <div>
              <h1>Dashboard Overview</h1>
              <p>Monitor your business performance and activities.</p>
            </div>

            <button
              className="date-button"
              onClick={() => alert("Showing November 2026 sample data")}
            >
              <Clock size={17} />
              November 2026
              <ChevronDown size={16} />
            </button>
          </div>

          {/* STAT CARDS */}
          <section className="stats-grid">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div className="stat-card" key={stat.title}>

                  <div className="stat-top">
                    <span>{stat.title}</span>
                    <div className={`stat-icon ${stat.color}`}>
                      <Icon size={21} />
                    </div>
                  </div>

                  <h2>
  {loadingStats ? "Loading..." : stat.value}
</h2>

                  <div className="stat-footer">
  <span>Live data from MongoDB</span>
</div>

                </div>
              );
            })}

          </section>

          {/* CHART AND INVENTORY */}
          <section className="middle-grid">

            <div className="panel sales-panel">

              <div className="panel-header">
                <div>
                  <h3>Sales Overview</h3>
                  <p>Weekly sales performance</p>
                </div>

                <button
                  className="more-button"
                  onClick={() => alert("Sales overview options")}
                >
                  <MoreHorizontal size={22} />
                </button>
              </div>

              <div className="sales-summary">
               <h2>{formatPeso(totalWeeklySales)}</h2>
                <span className="sales-growth">
                  <TrendingUp size={15} /> 12.5%
                </span>
                <p>Total sales this week</p>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 0
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="salesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e8edf4"
                    />

                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickFormatter={(value) => `₱${value / 1000}k`}
                    />

                    <Tooltip
                      formatter={(value) => [
                        formatPeso(value),
                        "Sales"
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>

            <div className="panel inventory-panel">

              <div className="panel-header">
                <div>
                  <h3>Inventory Summary</h3>
                  <p>Current stock overview</p>
                </div>

                <button
                  className="more-button"
                  onClick={() => setActivePage("Inventory")}
                >
                  <MoreHorizontal size={22} />
                </button>
              </div>

              <div className="inventory-total">
                <h2>{inventorySummary.total}</h2>
                <span>Total Products</span>
              </div>

              <div className="inventory-item">
                <div className="inventory-info">
                  <span className="inventory-dot in-stock"></span>
                  <span>In Stock</span>
                </div>
                <strong>{inventorySummary.inStock}</strong>
              </div>

              <div className="inventory-bar">
                <div className="bar-blue"></div>
              </div>

              <div className="inventory-item">
                <div className="inventory-info">
                  <span className="inventory-dot low-stock"></span>
                  <span>Low Stock</span>
                </div>
                <strong>{inventorySummary.lowStock}</strong>
              </div>

              <div className="inventory-bar">
                <div className="bar-orange"></div>
              </div>

              <div className="inventory-item">
                <div className="inventory-info">
                  <span className="inventory-dot out-stock"></span>
                  <span>Out of Stock</span>
                </div>
                <strong>{inventorySummary.outOfStock}</strong>
              </div>

              <div className="inventory-bar">
                <div className="bar-red"></div>
              </div>

              <button
                className="view-inventory"
                onClick={() => setActivePage("Inventory")}
              >
                View Inventory <ArrowUpRight size={16} />
              </button>

            </div>

          </section>

          {/* RECENT ORDERS */}
          <section className="panel orders-panel">

            <div className="panel-header">
              <div>
                <h3>Recent Orders</h3>
                <p>Latest customer transactions</p>
              </div>

              <button
                className="view-all"
                onClick={() => setActivePage("Orders")}
              >
                View All Orders <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="table-wrapper">
              <table className="orders-table">

                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>PRODUCT</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
  {filteredOrders.map((order) => (
    <tr key={order._id}>
      <td className="order-id">{order.orderNumber}</td>

      <td>
        {order.customer
          ? `${order.customer.firstname} ${order.customer.lastname}`
          : "Unknown Customer"}
      </td>

      <td>
        {order.items?.length > 0
          ? order.items[0].product?.name || "Product"
          : "No Products"}
        {order.items?.length > 1
          ? ` +${order.items.length - 1} more`
          : ""}
      </td>

      <td>
        {new Date(order.createdAt).toLocaleDateString("en-PH")}
      </td>

      <td className="amount">
        {formatPeso(order.totalAmount)}
      </td>

      <td>
        <span className={`status ${order.orderStatus.toLowerCase()}`}>
          {order.orderStatus === "Delivered" && <CheckCircle size={13} />}
          {order.orderStatus === "Processing" && <Truck size={13} />}
          {order.orderStatus === "Pending" && <Clock size={13} />}
          {order.orderStatus === "Cancelled" && <CircleAlert size={13} />}
          {order.orderStatus}
        </span>
      </td>

      <td>
        <button
          className="action-button"
          title="View order"
          onClick={() => alert(`Order details: ${order.orderNumber}`)}
        >
          <Eye size={17} />
        </button>
      </td>
    </tr>
  ))}

  {filteredOrders.length === 0 && (
    <tr>
      <td colSpan="7" className="empty-table">
        No matching orders found.
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>

          </section>

          <footer className="footer">
            <span>© 2026 ShopEase. All rights reserved.</span>
            <span>E-Commerce Management System · PHP Currency</span>
          </footer>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;
