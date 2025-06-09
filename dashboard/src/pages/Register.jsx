import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import containerImg from "../components/images/container3.png";
import PublicFooter from "../components/PublicFooter";
import PublicHeader from "../components/PublicHeader";

const Register = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "driver",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5050/api/auth/register", formData);
      const { token, user } = res.data;

      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case 'admin': navigate('/dashboard'); break;
        case 'crane_operator': navigate('/lots'); break;
        case 'driver': navigate('/checkin'); break;
        default: navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
        className="w-full h-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden flex flex-col justify-between"
        style={{ backgroundImage: `url(${containerImg})` }}
    >
      <PublicHeader />
      <div className="flex-grow flex items-center justify-center bg-black/50">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-center text-blue-700">Create Your Account</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="driver">Driver</option>
            <option value="crane_operator">Crane Operator</option>
          </select>

          {error && (
            <div className="text-red-600 border border-red-300 bg-red-100 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white py-2 rounded"
          >
            Register
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
      <PublicFooter />
    </div>
  );
};

export default Register;