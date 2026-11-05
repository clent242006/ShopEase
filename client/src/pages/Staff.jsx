
import { useEffect, useState } from "react";
import { Users, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import API from "../services/api";
import "./Staff.css";

function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/staff");
      setStaff(response.data.staff || []);
    } catch (error) {
      setMessage("Unable to load staff accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const resetForm = () => {
    setForm({
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("CREATE STAFF BUTTON CLICKED", form);
    setMessage("");
    

    try {
      if (editingId) {
        await API.put(`/admin/staff/${editingId}`, {
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email
        });
        setMessage("Staff updated successfully!");
      } else {
        await API.post("/admin/staff", form);
        setMessage("Staff account created successfully!");
      }

      resetForm();
      fetchStaff();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to save staff account."
      );
    }
  };

  const handleEdit = (member) => {
    setForm({
      firstname: member.firstname,
      lastname: member.lastname,
      email: member.email,
      password: ""
    });
    setEditingId(member._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff account?")) {
      return;
    }

    try {
      await API.delete(`/admin/staff/${id}`);
      setMessage("Staff account deleted successfully!");
      fetchStaff();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to delete staff account."
      );
    }
  };

  return (
    <div className="staff-page">
      <div className="staff-header">
        <div>
          <h1>Staff Management</h1>
          <p>Manage your ShopEase staff accounts.</p>
        </div>

        <div className="staff-actions">
          <button onClick={fetchStaff} className="staff-refresh">
            <RefreshCw size={17} /> Refresh
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="staff-add"
          >
            <Plus size={17} /> Add Staff
          </button>
        </div>
      </div>

      {message && <div className="staff-message">{message}</div>}

      <div className="staff-summary">
        <Users size={25} />
        <div>
          <p>Total Staff Members</p>
          <h2>{staff.length}</h2>
        </div>
      </div>

      {showForm && (
        <div className="staff-card">
          <h2>{editingId ? "Edit Staff" : "Create Staff Account"}</h2>

          <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              value={form.firstname}
              onChange={(e) =>
                setForm({ ...form, firstname: e.target.value })
              }
              required
            />

            <label>Last Name</label>
            <input
              value={form.lastname}
              onChange={(e) =>
                setForm({ ...form, lastname: e.target.value })
              }
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />

            {!editingId && (
              <>
                <label>Password</label>
                <input
                  type="password"
                  minLength="6"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </>
            )}

            <div className="staff-form-actions">
              <button type="submit" className="staff-save">
                {editingId ? "Save Changes" : "Create Account"}
              </button>

              <button
                type="button"
                className="staff-cancel"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="staff-card">
        <h2>Registered Staff</h2>

        {loading ? (
          <p>Loading staff accounts...</p>
        ) : staff.length === 0 ? (
          <p>No staff accounts found.</p>
        ) : (
          <div className="staff-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {staff.map((member) => (
                  <tr key={member._id}>
                    <td>
                      {member.firstname} {member.lastname}
                    </td>
                    <td>{member.email}</td>
                    <td><span className="staff-role">Staff</span></td>
                    <td>
                      <div className="staff-row-actions">
                        <button onClick={() => handleEdit(member)}>
                          <Pencil size={16} />
                        </button>

                        <button onClick={() => handleDelete(member._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default Staff;
