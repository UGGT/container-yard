import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import containerImg from "../components/images/container3.png"; // ✅ Background image
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5050/api/auth/login", { email, password });
      const { token, user } = res.data;

      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "admin":
          navigate("/dashboard");
          break;
        case "crane_operator":
          navigate("/operator");
          break;
        case "driver":
          navigate("/qr");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${containerImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

      <PublicHeader /> {/* ✅ Top Header */}

      <div className="flex flex-grow justify-center items-center relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-95 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-blue-700">Welcome Back 👋</h2>
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded border border-red-400">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-300"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-300"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
          >
            Login
          </button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>

      <PublicFooter /> {/* ✅ Bottom Footer */}
    </div>
  );
};

export default Login;