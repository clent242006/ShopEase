
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import API from "../services/api";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: ""
  });

  const fetchCustomers = async () => {
    try {
      const response = await API.get("/customers");
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to load customers.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/customers/${editingId}`, formData);
        alert("Customer updated successfully!");
      } else {
        await API.post("/customers", formData);
        alert("Customer added successfully!");
      }

      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: ""
      });

      setEditingId(null);
      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save customer.");
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || ""
    });

    setEditingId(customer._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await API.delete(`/customers/${id}`);
      alert("Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete customer.");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstname} ${customer.lastname} ${customer.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customers Management</h1>
          <p>Manage your ShopEase customer information.</p>
        </div>

        <button
          className="customer-add-btn"
          onClick={() => {
            setEditingId(null);
            setFormData({
              firstname: "",
              lastname: "",
              email: "",
              phone: "",
              address: ""
            });
            setShowForm(!showForm);
          }}
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {showForm && (
        <form className="customer-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Customer" : "Add New Customer"}</h2>

          <label>First Name</label>
          <input
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="Enter first name"
            required
          />

          <label>Last Name</label>
          <input
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Enter last name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />

          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />

          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />

          <div className="customer-form-actions">
            <button type="submit">
              {editingId ? "Update Customer" : "Save Customer"}
            </button>

            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="customer-search">
        <Search size={18} />
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="customer-table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <div className="customer-name">
                      <Users size={18} />
                      {customer.firstname} {customer.lastname}
                    </div>
                  </td>

                  <td>{customer.email}</td>
                  <td>{customer.phone || "—"}</td>
                  <td>{customer.address || "—"}</td>

                  <td>
                    <div className="customer-actions">
                      <button onClick={() => handleEdit(customer)}>
                        <Edit size={17} />
                      </button>

                      <button onClick={() => handleDelete(customer._id)}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="customer-empty">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
