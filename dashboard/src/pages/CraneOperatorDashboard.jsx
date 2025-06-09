// src/pages/CraneOperatorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackgroundWrapper from "../components/BackgroundWrapper";

const CraneOperatorDashboard = () => {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssigned = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/checkins/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssigned(res.data);
    } catch (err) {
      toast.error('Failed to fetch assigned containers');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5050/api/checkins/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Marked as completed ✅');
      fetchAssigned();
    } catch (err) {
      toast.error('Failed to mark as completed');
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  return (
    <BackgroundWrapper>
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🛠 Assigned Containers</h2>
      <ToastContainer position="bottom-right" autoClose={3000} />
      {loading ? (
        <p>Loading...</p>
      ) : assigned.length === 0 ? (
        <p className="text-gray-500">No pending containers assigned.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Container</th>
              <th className="p-2">Driver</th>
              <th className="p-2">Transport</th>
              <th className="p-2">Lot</th>
              <th className="p-2">Time</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assigned.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{row.container_number}</td>
                <td className="p-2">{row.driver_name}</td>
                <td className="p-2">{row.transport_name}</td>
                <td className="p-2 font-semibold">{row.assigned_lot}</td>
                <td className="p-2 text-xs text-gray-600">{new Date(row.timestamp).toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => markComplete(row.id)}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Mark Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </BackgroundWrapper>
  );
};

export default CraneOperatorDashboard;
