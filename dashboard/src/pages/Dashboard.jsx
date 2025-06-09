import React, { useEffect, useState } from "react";
import { fetchCheckins } from "../api/api";
import BackgroundWrapper from "../components/BackgroundWrapper";

const Dashboard = () => {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCheckins();
      setCheckins(data);
    };
    load();
  }, []);

  return (
    <BackgroundWrapper>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Live Check-In Logs</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Type</th>
            <th className="p-2">Container</th>
            <th className="p-2">Driver</th>
            <th className="p-2">Transport</th>
            <th className="p-2">Lot</th>
            <th className="p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {checkins.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{c.type}</td>
              <td className="p-2">{c.container_number}</td>
              <td className="p-2">{c.driver_name}</td>
              <td className="p-2">{c.transport_name}</td>
              <td className="p-2 text-blue-600 font-bold">{c.assigned_lot}</td>
              <td className="p-2">{new Date(c.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </BackgroundWrapper>
  );
};

export default Dashboard;