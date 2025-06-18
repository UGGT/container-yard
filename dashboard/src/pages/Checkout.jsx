import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackgroundWrapper from "../components/BackgroundWrapper";


const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5050"
    : "https://container-yard-1.onrender.com";


const Checkout = () => {
  const [form, setForm] = useState({
    containerNumber: "",
    driverName: "",
    transportName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5050/api/checkins/outgoing",
        {
          containerNumber: form.containerNumber,
          driverName: form.driverName,
          transportName: form.transportName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        ` Checkout Registered — Proceed to lot: ${res.data.assignedLot}`
      );
      navigate('/yard-map', { state: { assignedLot: res.data.assignedLot } });
      setForm({ containerNumber: "", driverName: "", transportName: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "❌ Checkout failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-green-700">
         Container Check-Out
      </h2>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <form onSubmit={handleCheckout} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Container Number</label>
          <input
            type="text"
            name="containerNumber"
            value={form.containerNumber}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded shadow-sm"
            placeholder="e.g. XYZU9876543"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Driver Name</label>
          <input
            type="text"
            name="driverName"
            value={form.driverName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded shadow-sm"
            placeholder="Driver full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Transport Name</label>
          <input
            type="text"
            name="transportName"
            value={form.transportName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded shadow-sm"
            placeholder="e.g. ABC Logistics"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 font-semibold rounded hover:bg-green-700 transition"
        >
          {loading ? "Processing..." : "Submit Check-Out"}
        </button>
      </form>
    </div>
    </BackgroundWrapper>
  );
};

export default Checkout;