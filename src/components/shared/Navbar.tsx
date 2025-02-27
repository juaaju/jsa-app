// src/components/shared/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              JSA System
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2"
            >
              Home
            </Link>
            <Link 
              to="/new-jsa" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2"
            >
              New JSA
            </Link>
            <Link 
              to="/analysis" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2"
            >
              Analysis
            </Link>
            <Link 
              to="/actions" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2"
            >
              Actions
            </Link>
            <Link 
              to="/history" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2"
            >
              History
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">John Doe</span>
            <button className="text-gray-600 hover:text-blue-600">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;