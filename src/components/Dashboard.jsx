import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageURLs, setImageURLs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar toggle

  // Check authorization
  useEffect(() => {
    if (!localStorage.getItem('isAuthorized')) {
      navigate('/');
    }
  }, [navigate]);

  // Fetch items from backend
  const fetchItems = () => {
    axios.get("http://127.0.0.1:5001/get_items")
      .then((res) => setItems(res.data.items))
      .catch((err) => {
        console.error("Error fetching items:", err);
        setErrorMessage(err.response?.data?.error || 'Failed to fetch items. Please try again.');
      });
  };

  // Fetch feedbacks from backend
  const fetchFeedbacks = () => {
    axios.get("http://127.0.0.1:5001/api/feedback")
      .then((res) => {
        const formattedFeedbacks = res.data.map((fb) => ({
          id: fb.id,
          username: fb.name,
          text: fb.feedback,
          photo: `https://picsum.photos/50?random=${fb.id}`,
        }));
        setFeedbacks(formattedFeedbacks);
      })
      .catch((err) => {
        console.error("Error fetching feedbacks:", err);
        setErrorMessage(err.response?.data?.error || 'Failed to fetch feedbacks. Please try again.');
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (activeSection === 'feedback') {
      fetchFeedbacks();
    }
  }, [activeSection]);

  // Add a new item
  const handleAddItem = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!itemName.trim()) {
      setErrorMessage('Item name is required.');
      return;
    }
    if (!category) {
      setErrorMessage('Please select a category.');
      return;
    }
    if (!cuisine.trim()) {
      setErrorMessage('Cuisine is required.');
      return;
    }
    if (!actualPrice || parseFloat(actualPrice) <= 0) {
      setErrorMessage('Please enter a valid actual price greater than 0.');
      return;
    }
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      setErrorMessage('Please enter a valid selling price greater than 0.');
      return;
    }

    axios.post("http://127.0.0.1:5001/add_item", { 
      name: itemName.trim(), 
      category, 
      cuisine: cuisine.trim(), 
      selling_price: parseFloat(sellingPrice),
      actual_price: parseFloat(actualPrice)
    })
      .then(() => {
        setItemName('');
        setCategory('');
        setCuisine('');
        setActualPrice('');
        setSellingPrice('');
        fetchItems();
      })
      .catch((err) => {
        console.error("Error adding item:", err);
        const serverMessage = err.response?.data?.error || 'Failed to add item. Please try again.';
        setErrorMessage(serverMessage);
      });
  };

  // Delete an item
  const handleDeleteItem = (itemName) => {
    axios.post("http://127.0.0.1:5001/delete_items", { items: [itemName] })
      .then(() => fetchItems())
      .catch((err) => {
        console.error("Error deleting item:", err);
        setErrorMessage(err.response?.data?.error || 'Failed to delete item. Please try again.');
      });
  };

  // Place an order
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedItem || !quantity || parseInt(quantity) <= 0) {
      setErrorMessage('Please select an item and enter a valid quantity greater than 0.');
      return;
    }

    const order = {
      items: [selectedItem],
      datetime: new Date().toISOString(),
    };

    axios.post("http://127.0.0.1:5001/place_order", order)
      .then(() => {
        const selectedItemData = items.find(item => item.name === selectedItem);
        const actualPrice = parseFloat(selectedItemData.actual_price);
        const sellingPrice = parseFloat(selectedItemData.selling_price);
        const qty = parseInt(quantity);
        const totalPrice = sellingPrice * qty;
        const profitOrLoss = (sellingPrice - actualPrice) * qty;

        setOrders((prev) => [...prev, { 
          item: selectedItem, 
          quantity: qty,
          totalPrice: totalPrice,
          profitOrLoss: profitOrLoss
        }]);
        setSelectedItem('');
        setQuantity('');
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        setErrorMessage(err.response?.data?.error || 'Failed to place order. Please try again.');
      });
  };

  // Remove an order from the list
  const handleRemoveOrder = (index) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch visualizations
  const handleVisualize = () => {
    axios.get("http://127.0.0.1:5001/visualize")
      .then((res) => setImageURLs(res.data.images))
      .catch((err) => {
        console.error("Error fetching graphs:", err);
        setErrorMessage(err.response?.data?.error || 'Failed to fetch visualizations. Please try again.');
      });
  };

  const handleSidebarClick = (section) => {
    setActiveSection(section);
    setErrorMessage('');
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const renderContent = () => {
    if (!activeSection) {
      return (
        <div className="p-4 sm:p-6">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#fbbf24] mb-3 sm:mb-4">Welcome to Your Dashboard!</h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Manage your restaurant with ease. Add items, place orders, visualize data, or check customer feedback to get started!
            </p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'add-item':
        return (
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#fbbf24] mb-3 sm:mb-4">Add an Item</h2>
            {errorMessage && (
              <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{errorMessage}</p>
            )}
            <form onSubmit={handleAddItem} className="mb-4 sm:mb-6 grid grid-cols-1 md:grid-cols-5 gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="p-2 border rounded text-black text-sm sm:text-base"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border rounded text-black text-sm sm:text-base"
              >
                <option value="">Select Category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
              <input
                type="text"
                placeholder="Cuisine (e.g., Italian)"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="p-2 border rounded text-black text-sm sm:text-base"
              />
              <input
                type="number"
                placeholder="Actual Price (e.g., 8.99)"
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                className="p-2 border rounded text-black text-sm sm:text-base"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder="Selling Price (e.g., 10.99)"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="p-2 border rounded text-black text-sm sm:text-base"
                min="0"
                step="0.01"
              />
              <button type="submit" className="bg-[#fbbf24] hover:bg-yellow-400 text-black py-2 px-3 sm:px-4 rounded md:col-span-5 text-sm sm:text-base">
                Add Item
              </button>
            </form>

            {items.length > 0 ? (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">Added Items:</h3>
                <ul className="space-y-2">
                  {items.map((item, index) => {
                    const profitOrLoss = parseFloat(item.selling_price) - parseFloat(item.actual_price);
                    const isProfit = profitOrLoss > 0;
                    return (
                      <li key={index} className="p-2 sm:p-3 bg-gray-800 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-sm sm:text-base">{item.name} - {item.category} ({item.cuisine})</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-gray-300 text-sm sm:text-base">Price: ₹{parseFloat(item.selling_price).toFixed(2)}</span>
                          <span className={`${isProfit ? "text-green-500" : "text-red-500"} text-sm sm:text-base`}>
                            {isProfit ? "Profit" : "Loss"}: ₹{Math.abs(profitOrLoss).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleDeleteItem(item.name)}
                            className="text-red-500 hover:text-red-700 text-lg sm:text-xl"
                            title="Delete Item"
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="text-gray-300 text-sm sm:text-base">No items added yet.</p>
            )}
          </div>
        );

      case 'place-order':
        const selectedItemData = items.find(item => item.name === selectedItem);
        const totalCost = selectedItemData && quantity ? (parseFloat(selectedItemData.selling_price) * parseInt(quantity)).toFixed(2) : '0.00';

        return (
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#fbbf24] mb-3 sm:mb-4">Place Order</h2>
            {errorMessage && (
              <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{errorMessage}</p>
            )}
            <form onSubmit={handlePlaceOrder} className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full p-2 border rounded text-black text-sm sm:text-base"
              >
                <option value="">Select Item</option>
                {items.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name} ({item.category}, {item.cuisine}) - ₹{parseFloat(item.selling_price).toFixed(2)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border rounded text-black text-sm sm:text-base"
                min="1"
              />
              <p className="text-gray-300 text-sm sm:text-base">Total Cost: ₹{totalCost}</p>
              <button type="submit" className="bg-[#fbbf24] hover:bg-yellow-400 text-black py-2 px-3 sm:px-4 rounded w-full sm:w-auto text-sm sm:text-base">
                Place Order
              </button>
            </form>

            {orders.length > 0 ? (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">Placed Orders:</h3>
                <ul className="space-y-2">
                  {orders.map((order, index) => {
                    const isProfit = order.profitOrLoss > 0;
                    return (
                      <li key={index} className="p-2 sm:p-3 bg-gray-800 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-sm sm:text-base">{order.quantity}x {order.item}</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-gray-300 text-sm sm:text-base">Price: ₹{order.totalPrice.toFixed(2)}</span>
                          <span className={`${isProfit ? "text-green-500" : "text-red-500"} text-sm sm:text-base`}>
                            {isProfit ? "Profit" : "Loss"}: ₹{Math.abs(order.profitOrLoss).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveOrder(index)}
                            className="text-red-500 hover:text-red-700 text-lg sm:text-xl"
                            title="Remove Order"
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="text-gray-300 text-sm sm:text-base">No orders placed yet.</p>
            )}
          </div>
        );

      case 'visualize':
        return (
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#fbbf24] mb-3 sm:mb-4">Visualize</h2>
            {errorMessage && (
              <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{errorMessage}</p>
            )}
            <button
              onClick={handleVisualize}
              className="mb-3 sm:mb-4 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
            >
              Generate Visualizations
            </button>
            {imageURLs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {imageURLs.map((url, i) => (
                  <div key={i} className="bg-gray-800 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-[#fbbf24] mb-2">
                      {url.split('/').pop().replace('.png', '').replace('_', ' ').toUpperCase()}
                    </h3>
                    <img
                      src={url}
                      alt={`Graph ${i + 1}`}
                      className="rounded border w-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-sm sm:text-base">Click the button to generate visualizations.</p>
            )}
          </div>
        );

      case 'feedback':
        return (
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#fbbf24] mb-3 sm:mb-4">Customer Feedbacks</h2>
            {errorMessage && (
              <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{errorMessage}</p>
            )}
            {feedbacks.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-3 sm:p-4 bg-gray-800 rounded-lg flex items-start space-x-3 sm:space-x-4">
                    <img src={feedback.photo} alt={`${feedback.username} avatar`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                    <div className="flex-1">
                      <p className="text-[#1DA1F2] font-semibold text-sm sm:text-base">{feedback.username}</p>
                      <p className="text-gray-300 text-sm sm:text-base">{feedback.text}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">{feedback.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-sm sm:text-base">No feedback available yet.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0f172a] text-white min-h-screen flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg text-[#fbbf24]"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`w-64 bg-gray-900 h-screen fixed top-0 left-0 flex flex-col z-40 transition-transform duration-300 md:transition-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-3 sm:p-4 text-xl sm:text-2xl font-bold text-[#fbbf24] border-b border-gray-700">
          Dashboard
        </div>
        <div className="flex-1">
          <button onClick={() => handleSidebarClick('add-item')} className={`w-full flex items-center p-3 sm:p-4 text-left transition-colors duration-200 ${activeSection === 'add-item' ? 'bg-[#fbbf24] text-black' : 'text-gray-300 hover:bg-gray-800'} text-sm sm:text-base`}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add an Item
          </button>
          <button onClick={() => handleSidebarClick('place-order')} className={`w-full flex items-center p-3 sm:p-4 text-left transition-colors duration-200 ${activeSection === 'place-order' ? 'bg-[#fbbf24] text-black' : 'text-gray-300 hover:bg-gray-800'} text-sm sm:text-base`}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-2 12H5L3 3zm4 18a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
            Place Order
          </button>
          <button onClick={() => handleSidebarClick('visualize')} className={`w-full flex items-center p-3 sm:p-4 text-left transition-colors duration-200 ${activeSection === 'visualize' ? 'bg-[#fbbf24] text-black' : 'text-gray-300 hover:bg-gray-800'} text-sm sm:text-base`}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Visualize
          </button>
          <button onClick={() => handleSidebarClick('feedback')} className={`w-full flex items-center p-3 sm:p-4 text-left transition-colors duration-200 ${activeSection === 'feedback' ? 'bg-[#fbbf24] text-black' : 'text-gray-300 hover:bg-gray-800'} text-sm sm:text-base`}>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Customer Feedbacks
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-4 sm:p-6 pt-14 md:pt-6 ${isSidebarOpen ? 'ml-0' : 'md:ml-64'} transition-all duration-300`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
