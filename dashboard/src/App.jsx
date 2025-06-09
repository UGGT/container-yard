import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LotGrid from "./pages/LotGrid";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkin from "./pages/Checkin";
import PrivateRoute from "./components/PrivateRoute";
import CheckinHistory from './pages/CheckinHistory';
import UserManagement from './pages/UserManagement';
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import QRFlow from "./pages/QRFlow";
import CraneOperatorPanel from "./pages/CraneOperatorPanel";
import Navbar from "./components/Navbar";
import AdminAnalytics from "./pages/AdminAnalytics";
import YardMap from './pages/YardMap';

const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Role-Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/lots"
          element={
            <PrivateRoute roles={["admin", "crane_operator"]}>
              <LotGrid />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminAnalytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute roles={["admin", "crane_operator", "driver"]}>
              <CheckinHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/yard-map"
          element={
            <PrivateRoute roles={['driver']}>
              <YardMap />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute roles={["admin"]}>
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkin"
          element={
            <PrivateRoute roles={["driver"]}>
              <Checkin />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute roles={["driver"]}>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/qr"
          element={
            <PrivateRoute roles={["driver"]}>
              <QRFlow />
            </PrivateRoute>
          }
        />
        <Route
          path="/operator"
          element={
            <PrivateRoute roles={["crane_operator"]}>
              <CraneOperatorPanel />
            </PrivateRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;