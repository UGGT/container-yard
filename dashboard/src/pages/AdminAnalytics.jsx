// src/pages/AdminAnalytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BackgroundWrapper from "../components/BackgroundWrapper";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

const AdminAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [craneData, setCraneData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const summaryRes = await axios.get("http://localhost:5050/api/analytics/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const craneRes = await axios.get("http://localhost:5050/api/analytics/crane-activity", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSummary(summaryRes.data);
      setCraneData(craneRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading analytics...</div>;

  if (!summary) return <div className="p-6 text-center text-red-500">Failed to load summary data.</div>;

  return (
    <BackgroundWrapper>
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">📊 Admin Analytics</h2>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-lg font-semibold mb-2">Container Movement Summary</h3>
          <ul className="mb-4 space-y-1">
            <li>🚛 Incoming Containers: <strong>{summary.incoming}</strong></li>
            <li>🚚 Outgoing Containers: <strong>{summary.outgoing}</strong></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">📈 Crane Operator Activity</h3>
          {craneData.length === 0 ? (
            <p className="text-gray-500">No activity recorded.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={craneData}
                  dataKey="moves"
                  nameKey="operator"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {craneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
    </BackgroundWrapper>
  );
};

export default AdminAnalytics;