// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center text-gray-600 text-sm py-4 border-t mt-10">
      <div className="max-w-7xl mx-auto">
        &copy; {new Date().getFullYear()} G&S Container Yard Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;