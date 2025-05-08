import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <div className="w-full overflow-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;