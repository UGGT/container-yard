// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/roleUtils";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold"> Container Yard</div>

      <div className="flex space-x-4 text-sm">
        {user?.role === "admin" && (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/lots" className="hover:underline">Lots</Link>
            <Link to="/users" className="hover:underline">Users</Link>
            <Link to="/history" className="hover:underline">History</Link>
          </>
        )}
        {user?.role === "crane_operator" && (
          <>
            <Link to="/operator" className="hover:underline">Operator Panel</Link>
            <Link to="/lots" className="hover:underline">Lots</Link>
            <Link to="/history" className="hover:underline">History</Link>
          </>
        )}
        {user?.role === "driver" && (
          <>
            <Link to="/qr" className="hover:underline">QR Flow</Link>
            <Link to="/checkin" className="hover:underline">Check-In</Link>
            <Link to="/checkout" className="hover:underline">Check-Out</Link>
            <Link to="/history" className="hover:underline">History</Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="ml-4 bg-white text-blue-700 font-medium px-3 py-1 rounded hover:bg-blue-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;