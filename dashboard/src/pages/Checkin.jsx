import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackgroundWrapper from "../components/BackgroundWrapper";


const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5050"
    : "https://container-yard-1.onrender.com";

const Checkin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    containerNumber: "",
    driverName: "",
    driverPhone: "",
    transportName: "",
    transportPhone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "https://container-yard-1.onrender.com/api/checkins/incoming",
        {
          containerNumber: form.containerNumber,
          driverName: form.driverName,
          driverPhone: form.driverPhone,
          transportName: form.transportName,
          transportPhone: form.transportPhone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const assignedLot = res.data.assignedLot;
      toast.success(`✅ Incoming registered! Assigned lot: ${assignedLot}`);

      navigate("/yard-map", {
        state: { assignedLot, entryLot: "ENTRY" },
      });

      setForm({
        containerNumber: "",
        driverName: "",
        driverPhone: "",
        transportName: "",
        transportPhone: "",
      });
    } catch (err) {
      toast.error("❌ Check-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        🚚 Container Check-In
      </h2>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Container Number</label>
          <input
            name="containerNumber"
            value={form.containerNumber}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded shadow-sm"
            placeholder="e.g. ABCU1234567"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Transport Name</label>
          <input
            name="transportName"
            value={form.transportName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded shadow-sm"
            placeholder="e.g. Sai Transports"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Transport Phone</label>
          <input
            name="transportPhone"
            value={form.transportPhone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded shadow-sm"
            placeholder="e.g. +14161234567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Driver Name</label>
          <input
            name="driverName"
            value={form.driverName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded shadow-sm"
            placeholder="e.g. Krishna"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Driver Phone</label>
          <input
            name="driverPhone"
            value={form.driverPhone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded shadow-sm"
            placeholder="e.g. +14162345678"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 font-semibold rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Submit Check-In"}
        </button>
      </form>
    </div>
    </BackgroundWrapper>
  );
};

export default Checkin;