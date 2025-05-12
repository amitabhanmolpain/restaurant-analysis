import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Dashboard from './components/Dashboard';
import MenuManager from './components/MenuManager';

const App = () => {
  return (
    <div className="w-full overflow-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<MenuManager />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
