import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CraneOperatorPanel = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInYardContainers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5050/api/checkins/in-yard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      toast.error("Failed to fetch containers in yard");
    }
  };

  const markCompleted = async (id) => {
    console.log("Marking complete for ID:", id);
    if (!id) {
      toast.error("Invalid container ID");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5050/api/checkins/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Marked as completed");
      fetchInYardContainers();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  useEffect(() => {
    fetchInYardContainers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">🛠️ Crane Operator Panel</h2>
      {assignments.length === 0 ? (
        <p className="text-gray-500">No containers currently in the yard.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Container</th>
              <th className="p-2">Driver</th>
              <th className="p-2">Transport</th>
              <th className="p-2">Lot</th>
              <th className="p-2">Timestamp</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item, index) => (
              <tr key={item.id || index} className="border-t hover:bg-gray-50">
                <td className="p-2 font-semibold">{item.container_number}</td>
                <td className="p-2">{item.driver_name}</td>
                <td className="p-2">{item.transport_name}</td>
                <td className="p-2 font-bold text-blue-600">{item.assigned_lot}</td>
                <td className="p-2 text-xs">{new Date(item.timestamp).toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => markCompleted(item.id)}
                    className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
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
  );
};

export default CraneOperatorPanel;