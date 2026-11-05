
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Tags } from "lucide-react";
import API from "../services/api";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active"
  });

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
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
        await API.put(`/categories/${editingId}`, formData);
        alert("Category updated successfully!");
      } else {
        await API.post("/categories", formData);
        alert("Category added successfully!");
      }

      setFormData({
        name: "",
        description: "",
        status: "Active"
      });

      setEditingId(null);
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save category.");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      status: category.status
    });

    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await API.delete(`/categories/${id}`);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete category.");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div>
          <h1>Categories Management</h1>
          <p>Organize and manage your product categories.</p>
        </div>

        <button
          className="category-add-btn"
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              description: "",
              status: "Active"
            });
            setShowForm(!showForm);
          }}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {showForm && (
        <form className="category-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>

          <label>Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter category description"
          />

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="category-form-actions">
            <button type="submit">
              {editingId ? "Update Category" : "Save Category"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="category-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category._id}>
                  <td>
                    <div className="category-name">
                      <Tags size={18} />
                      {category.name}
                    </div>
                  </td>

                  <td>{category.description || "No description"}</td>

                  <td>
                    <span className={`category-status ${category.status.toLowerCase()}`}>
                      {category.status}
                    </span>
                  </td>

                  <td>
                    <div className="category-actions">
                      <button onClick={() => handleEdit(category)}>
                        <Edit size={17} />
                      </button>

                      <button onClick={() => handleDelete(category._id)}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="category-empty">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;
