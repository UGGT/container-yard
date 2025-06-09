// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">Container Yard</h1>
        <nav className="space-x-6">
          <Link to="/operator" className="hover:underline">Operator Panel</Link>
          <Link to="/lots" className="hover:underline">Lots</Link>
          <Link to="/history" className="hover:underline">History</Link>
          <Link to="/analytics" className="hover:underline">Analytics</Link>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;