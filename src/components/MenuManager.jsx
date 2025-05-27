// src/components/MenuManager.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', cuisine: '' });
  const [imageURLs, setImageURLs] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/get_items');
      setItems(res.data.items || []);
      setMessage('');
    } catch (err) {
      console.error('Error fetching items:', err);
      setMessage('Failed to fetch items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.category.trim() || !newItem.cuisine.trim()) {
      setMessage('Please fill in all fields (name, category, cuisine).');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('http://127.0.0.1:5001/api/add_item', newItem);
      setNewItem({ name: '', category: '', cuisine: '' });
      await fetchItems();
      setMessage('Item added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error adding item:', err);
      setMessage('Failed to add item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemName) => {
    setIsLoading(true);
    try {
      await axios.post('http://127.0.0.1:5001/api/delete_items', { items: [itemName] });
      await fetchItems();
      setMessage('Item deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting item:', err);
      setMessage('Failed to delete item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisualize = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/visualize');
      setImageURLs(res.data.images || []);
      setMessage('Visualization loaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error fetching graphs:', err);
      setMessage('Failed to load visualizations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#0f172a] min-h-screen">
      <h1
        className="text-3xl font-bold mb-6 text-[#ebbf24]"
        style={{ fontFamily: "'Roboto', sans-serif'" }}
      >
        Menu Manager
      </h1>

      {message && (
        <p
          className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}
          style={{ fontFamily: "'Roboto', sans-serif'" }}
        >
          {message}
        </p>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="name"
          className="p-3 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] placeholder-gray-400"
          placeholder="Item name"
          value={newItem.name}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          type="text"
          name="category"
          className="p-3 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] placeholder-gray-400"
          placeholder="Category (e.g., Dinner)"
          value={newItem.category}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          type="text"
          name="cuisine"
          className="p-3 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] placeholder-gray-400"
          placeholder="Cuisine (e.g., Italian)"
          value={newItem.cuisine}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          onClick={handleAddItem}
          className="bg-[#ebbf24] text-black px-4 py-3 rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-500"
          disabled={isLoading}
          style={{ fontFamily: "'Roboto', sans-serif'" }}
        >
          Add
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-gray-400 mb-4" style={{ fontFamily: "'Roboto', sans-serif'" }}>
          Loading...
        </p>
      )}

      <ul className="mb-6">
        {items.length === 0 && !isLoading ? (
          <p className="text-gray-400 text-center" style={{ fontFamily: "'Roboto', sans-serif'" }}>
            No items found.
          </p>
        ) : (
          items.map((item) => (
            <li
              key={item.name}
              className="flex justify-between items-center border p-4 my-2 rounded-lg shadow-lg bg-[#1a2639] text-white"
            >
              <div>
                <span className="font-semibold">{item.name}</span> - {item.category} ({item.cuisine})
              </div>
              <button
                onClick={() => handleDeleteItem(item.name)}
                className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition disabled:bg-gray-500"
                disabled={isLoading}
                style={{ fontFamily: "'Roboto', sans-serif'" }}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      <button
        onClick={handleVisualize}
        className="mb-4 bg-[#ebbf24] text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-500"
        disabled={isLoading}
        style={{ fontFamily: "'Roboto', sans-serif'" }}
      >
        Visualize Orders
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {imageURLs.length === 0 ? (
          <p className="text-gray-400 text-center" style={{ fontFamily: "'Roboto', sans-serif'" }}>
            No visualizations available.
          </p>
        ) : (
          imageURLs.map((url, i) => (
            <div key={url} className="bg-[#1a2639] p-4 rounded-lg shadow-lg">
              <h3
                className="text-lg font-semibold text-[#ebbf24] mb-2"
                style={{ fontFamily: "'Roboto', sans-serif'" }}
              >
                {url
                  .split('/')
                  .pop()
                  .replace('.png', '')
                  .replace(/_/g, ' ')
                  .toUpperCase()}
              </h3>
              <img
                src={url}
                alt={`Graph ${i + 1}`}
                className="rounded border w-full"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found')}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuManager;
