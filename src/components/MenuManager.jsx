// src/components/MenuManager.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", category: "", cuisine: "" });
  const [imageURLs, setImageURLs] = useState([]);

  // Fetch menu items from backend
  const fetchItems = () => {
    axios.get("http://localhost:5000/get_items")
      .then((res) => setItems(res.data.items))
      .catch((err) => console.error("Error fetching items:", err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle input changes for new item
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new item
  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.category.trim() || !newItem.cuisine.trim()) {
      alert("Please fill in all fields (name, category, cuisine).");
      return;
    }
    axios.post("http://localhost:5000/add_item", newItem)
      .then(() => {
        setNewItem({ name: "", category: "", cuisine: "" });
        fetchItems();
      })
      .catch((err) => console.error("Error adding item:", err));
  };

  // Delete one item
  const handleDeleteItem = (itemName) => {
    axios.post("http://localhost:5000/delete_items", { items: [itemName] })
      .then(() => fetchItems())
      .catch((err) => console.error("Error deleting item:", err));
  };

  // Get visualizations
  const handleVisualize = () => {
    axios.get("http://localhost:5000/visualize")
      .then((res) => setImageURLs(res.data.images))
      .catch((err) => console.error("Error fetching graphs:", err));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#fbbf24]">Menu Manager</h1>

      {/* Add New Item */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          name="name"
          className="border p-2 rounded"
          placeholder="Item name"
          value={newItem.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          className="border p-2 rounded"
          placeholder="Category (e.g., Dinner)"
          value={newItem.category}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="cuisine"
          className="border p-2 rounded"
          placeholder="Cuisine (e.g., Italian)"
          value={newItem.cuisine}
          onChange={handleInputChange}
        />
        <button
          onClick={handleAddItem}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {/* Menu List */}
      <ul className="mb-6">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center border p-2 my-2 rounded shadow bg-gray-800 text-white"
          >
            <div>
              <span className="font-semibold">{item.name}</span> - {item.category} ({item.cuisine})
            </div>
            <button
              onClick={() => handleDeleteItem(item.name)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Visualize Button */}
      <button
        onClick={handleVisualize}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Visualize Orders
      </button>

      {/* Show Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {imageURLs.map((url, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#fbbf24] mb-2">
              {url.split('/').pop().replace('.png', '').replace('_', ' ').toUpperCase()}
            </h3>
            <img
              src={url} // Use the full URL directly
              alt={`Graph ${i + 1}`}
              className="rounded border w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManager;
