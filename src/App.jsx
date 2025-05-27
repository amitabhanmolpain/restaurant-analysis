import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Middle from './components/Middle';
import Dashboard from './components/Dashboard';
import MenuManager from './components/MenuManager';
import Features from './components/Features';

const App = () => {
  return (
    <div className="w-full min-h-screen"> {/* Removed overflow-hidden, added min-h-screen */}
      <Router>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/middle" element={<Middle />} /> {/* Added route for Middle */}
          <Route path="/Features" element={<Features />} /> {/* Added route for Middle */}
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<MenuManager />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
