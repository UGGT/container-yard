// src/pages/CheckinHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackgroundWrapper from "../components/BackgroundWrapper";



const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5050"
    : "https://container-yard-1.onrender.com";

const CheckinHistory = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    container: '',
    lot: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.container) params.append('container', filters.container);
      if (filters.lot) params.append('lot', filters.lot);
      if (filters.startDate) params.append('start', filters.startDate);
      if (filters.endDate) params.append('end', filters.endDate);
      params.append('page', page);
      params.append('limit', 10);

      const res = await axios.get(`http://localhost:5050/api/checkins?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLogs(res.data.logs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError('Failed to load check-in history');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1); // reset page before fetching
    setTimeout(() => fetchLogs(), 0); // fetch after state update
  };

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return (
    <BackgroundWrapper>
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📋 Container Check-In History</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          name="container"
          value={filters.container}
          onChange={handleChange}
          placeholder="Container #"
          className="border px-3 py-2 rounded"
        />
        <input
          name="lot"
          value={filters.lot}
          onChange={handleChange}
          placeholder="Lot Code"
          className="border px-3 py-2 rounded"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Types</option>
          <option value="incoming">Incoming</option>
          <option value="outgoing">Outgoing</option>
        </select>
        <input
          name="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="endDate"
          type="date"
          value={filters.endDate}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <div className="col-span-1 md:col-span-5">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
            Apply Filters
          </button>
        </div>
      </form>

      <table className="w-full border text-sm mb-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Type</th>
            <th className="p-2">Container #</th>
            <th className="p-2">Driver</th>
            <th className="p-2">Transport</th>
            <th className="p-2">Assigned Lot</th>
            <th className="p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {(logs || []).map((log) => (
            <tr key={log.id} className="border-t hover:bg-gray-50">
              <td className="p-2 capitalize">{log.type}</td>
              <td className="p-2">{log.container_number}</td>
              <td className="p-2">{log.driver_name || '-'}</td>
              <td className="p-2">{log.transport_name || '-'}</td>
              <td className="p-2 font-semibold">{log.assigned_lot}</td>
              <td className="p-2 text-xs text-gray-600">
                {new Date(log.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center text-sm">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    </BackgroundWrapper>
  );
};

export default CheckinHistory;