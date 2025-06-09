// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackgroundWrapper from "../components/BackgroundWrapper";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({ incoming: 0, outgoing: 0 });
  const [craneData, setCraneData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchSummary();
    fetchCraneStats();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/analytics/summary', authHeader);
      setSummary(res.data);
    } catch (err) {
      console.error('Summary fetch error', err);
    }
  };

  const fetchCraneStats = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/analytics/crane-activity', authHeader);
      setCraneData(res.data);
    } catch (err) {
      console.error('Crane stats fetch error', err);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const res = await axios.get(`http://localhost:5050/api/analytics/search?container=${search}`, authHeader);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search error', err);
    }
  };

  return (
    <BackgroundWrapper>
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">📊 Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Incoming</h3>
          <p className="text-2xl font-bold">{summary.incoming}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Outgoing</h3>
          <p className="text-2xl font-bold">{summary.outgoing}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Crane Ops Tracked</h3>
          <p className="text-2xl font-bold">{craneData.length}</p>
        </div>
      </div>

      {/* Crane Activity Table */}
      <div>
        <h3 className="text-xl font-semibold mb-2">🏗️ Crane Operator Activity</h3>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Operator</th>
              <th className="p-2 text-left">Moves</th>
            </tr>
          </thead>
          <tbody>
            {craneData.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2 font-medium">{row.operator}</td>
                <td className="p-2">{row.moves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Container Search */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">🔍 Search Container</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter container number..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Container</th>
                <th className="p-2 text-left">Driver</th>
                <th className="p-2 text-left">Transport</th>
                <th className="p-2 text-left">Lot</th>
                <th className="p-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((entry, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 capitalize">{entry.type}</td>
                  <td className="p-2">{entry.container_number}</td>
                  <td className="p-2">{entry.driver_name}</td>
                  <td className="p-2">{entry.transport_name}</td>
                  <td className="p-2">{entry.assigned_lot}</td>
                  <td className="p-2 text-xs text-gray-600">{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </BackgroundWrapper>
  );
};

export default AdminDashboard;
