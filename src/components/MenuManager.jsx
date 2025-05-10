// src/components/MenuManager.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MenuManager = () => {
  const [items, setItems] = useState([]);

  // Fetch items on component load
  useEffect(() => {
    axios.get("http://localhost:5000/get_items")
      .then((res) => {
        setItems(res.data.items);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="border p-2 my-1 rounded shadow">{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MenuManager;
