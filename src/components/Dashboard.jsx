// Import React and useState hook for managing component state
import React, { useState } from 'react';

// Main Dashboard Component
const Dashboard = () => {
  // State to control which section is active (add item, place order, etc.)
  const [activeSection, setActiveSection] = useState(null);

  // State to store list of items added
  const [items, setItems] = useState([]);

  // State to store orders placed
  const [orders, setOrders] = useState([]);

  // Form states for item addition
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');

  // Form states for order placement
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');

  // Simulated customer feedbacks (mock tweets with avatars)
  const customerFeedbacks = [
    { id: 1, username: "@foodie123", text: "Loved the Dosa! So crispy and delicious! 🌟", photo: "https://picsum.photos/50?random=1" },
    { id: 2, username: "@tastybites", text: "Best Biryani in town! Will definitely come back. 🍗", photo: "https://picsum.photos/50?random=2" },
    { id: 3, username: "@spicylover", text: "The Paneer Tikka was amazing! Spices were on point. 🔥", photo: "https://picsum.photos/50?random=3" },
    { id: 4, username: "@hungrytraveler", text: "Great ambiance and food! Highly recommend the Naan. 🥙", photo: "https://picsum.photos/50?random=4" },
    { id: 5, username: "@foodexplorer", text: "Samosas were fantastic! Perfect snack. 😋", photo: "https://picsum.photos/50?random=5" },
    { id: 6, username: "@curryking", text: "Butter Chicken was heavenly! Great service too. 🥘", photo: "https://picsum.photos/50?random=6" },
    { id: 7, username: "@flavorfan", text: "Tried the Thali, loved the variety! 🌍", photo: "https://picsum.photos/50?random=7" },
    { id: 8, username: "@yummytummy", text: "Chole Bhature was a delight! So filling. 🍽️", photo: "https://picsum.photos/50?random=8" },
    { id: 9, username: "@spicequeen", text: "Amazing Vada Pav! Tastes like home. 🏡", photo: "https://picsum.photos/50?random=9" },
    { id: 10, username: "@eatwithlove", text: "The Lassi was refreshing! Perfect end to the meal. 🥤", photo: "https://picsum.photos/50?random=10" },
  ];

  // Handle item submission by adding new item to state
  const handleAddItem = (e) => {
    e.preventDefault(); // Prevents page reload
    if (!itemName || !price) {
      alert('Please enter both item name and price.');
      return;
    }

    // Create new item and add it to state
    const newItem = { name: itemName, price: parseFloat(price) };
    setItems([...items, newItem]);

    // Clear form after submission
    setItemName('');
    setPrice('');
  };

  // Handle item deletion by removing item from state
  const handleDeleteItem = (indexToDelete) => {
    setItems(items.filter((_, index) => index !== indexToDelete));
  };

  // Handle order placement by adding new order to state
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!selectedItem || !quantity) {
      alert('Please select an item and enter a quantity.');
      return;
    }

    // Find selected item price and calculate total
    const selectedItemObj = items.find(item => item.name === selectedItem);
    const newOrder = {
      item: selectedItem,
      quantity: parseInt(quantity),
      total: selectedItemObj.price * parseInt(quantity),
    };
    setOrders([...orders, newOrder]);

    // Clear form after submission
    setSelectedItem('');
    setQuantity('');
  };

  // Handle sidebar navigation by setting active section
  const handleSidebarClick = (section) => {
    setActiveSection(section);
  };

  // Conditionally render UI based on selected section
  const renderContent = () => {
    if (!activeSection) {
      // Welcome section shown when no sidebar item is selected
      return (
        <div className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold text-[#fbbf24] mb-4">Welcome to Your Dashboard!</h2>
            <p className="text-gray-300 text-lg">
              Manage your restaurant with ease. Add items, place orders, visualize data, or check customer feedback to get started!
            </p>
          </div>
        </div>
      );
    }

    // Render section based on active state
    switch (activeSection) {
      case 'add-item':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-[#fbbf24] mb-4">Add an Item</h2>
            {/* Form for adding new items */}
            <form onSubmit={handleAddItem} className="mb-6">
              <input
                type="text"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full p-2 mb-2 border rounded text-black"
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 mb-2 border rounded text-black"
                min="0"
                step="0.01"
              />
              <button type="submit" className="bg-[#fbbf24] hover:bg-yellow-400 text-black py-2 px-4 rounded">
                Add Item
              </button>
            </form>

            {/* Display list of added items */}
            {items.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Added Items:</h3>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="p-3 bg-gray-800 rounded flex justify-between items-center">
                      <span>{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <span>₹{item.price.toFixed(2)}</span>
                        {/* Delete button with larger cross icon */}
                        <button
                          onClick={() => handleDeleteItem(index)}
                          className="text-red-500 hover:text-red-700 text-xl"
                          title="Delete Item"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-300">No items added yet.</p>
            )}
          </div>
        );

      case 'place-order':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-[#fbbf24] mb-4">Place Order</h2>
            {/* Form for placing orders */}
            <form onSubmit={handlePlaceOrder} className="mb-6">
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full p-2 mb-2 border rounded text-black"
              >
                <option value="">Select Item</option>
                {items.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name} (₹{item.price.toFixed(2)})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 mb-2 border rounded text-black"
                min="1"
              />
              <button type="submit" className="bg-[#fbbf24] hover:bg-yellow-400 text-black py-2 px-4 rounded">
                Place Order
              </button>
            </form>

            {/* Show placed orders */}
            {orders.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Placed Orders:</h3>
                <ul className="space-y-2">
                  {orders.map((order, index) => (
                    <li key={index} className="p-3 bg-gray-800 rounded flex justify-between">
                      <span>{order.quantity}x {order.item}</span>
                      <span>Total: ₹{order.total.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-300">No orders placed yet.</p>
            )}
          </div>
        );

      case 'visualize':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-[#fbbf24] mb-4">Visualize</h2>
            <p className="text-gray-300">This is where you can visualize data (e.g., sales, orders).</p>
            <div className="mt-4 w-full h-64 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Chart Placeholder</p>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-[#fbbf24] mb-4">Customer Feedbacks</h2>
            {/* Display customer feedback */}
            <div className="space-y-4">
              {customerFeedbacks.map((feedback) => (
                <div key={feedback.id} className="p-4 bg-gray-800 rounded-lg flex items-start space-x-4">
                  <img src={feedback.photo} alt={`${feedback.username} avatar`} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <p className="text-[#1DA1F2] font-semibold">{feedback.username}</p>
                    <p className="text-gray-300">{feedback.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0f172a] text-white min-h-screen flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-900 h-screen fixed top-0 left-0 flex flex-col">
        <div className="p-4 text-2xl font-bold text-[#fbbf24] border-b border-gray-700">
          Dashboard
        </div>
        <div className="flex-1">
          {/* Sidebar Buttons */}
          <button onClick={() => handleSidebarClick('add-item')} className={`w-full flex items-center p-4 text-left transition-colors duration-200 ${activeSection === 'add-item' ? 'bg-[#fbbf24] text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
            {/* Icon + Label */}
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add an Item
          </button>

          <button onClick={() => handleSidebarClick('place-order')} className={`w-full flex items-center p-4 text-left transition-colors duration-200 ${activeSection === 'place-order' ? 'bg-[#fbbf24] text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-2 12H5L3 3zm4 18a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
            Place Order
          </button>

          <button onClick={() => handleSidebarClick('visualize')} className={`w-full flex items-center p-4 text-left transition-colors duration-200 ${activeSection === 'visualize' ? 'bg-[#fbbf24] text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Visualize
          </button>

          <button onClick={() => handleSidebarClick('feedback')} className={`w-full flex items-center p-4 text-left transition-colors duration-200 ${activeSection === 'feedback' ? 'bg-[#fbbf24] text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Customer Feedbacks
          </button>
        </div>
      </div>

      {/* Content changes dynamically based on active section */}
      <div className="ml-64 flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
};

// Export the component
export default Dashboard;