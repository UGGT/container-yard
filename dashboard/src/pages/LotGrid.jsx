import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackgroundWrapper from "../components/BackgroundWrapper";

const socket = io("http://localhost:5050");

const LotGrid = () => {
  const [lots, setLots] = useState([]);

  const fetchLots = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/lots/status");
      setLots(res.data);
    } catch (err) {
      console.error("Failed to fetch lot status", err);
    }
  };

  const clearLot = async (lotCode) => {
    try {
      await axios.patch(`http://localhost:5050/api/lots/${lotCode}/clear`);
      fetchLots();
    } catch (err) {
      console.error("Failed to clear lot", err);
    }
  };

  const occupyLot = async (lotCode) => {
    try {
      await axios.patch(`http://localhost:5050/api/lots/${lotCode}/occupy`);
      fetchLots();
    } catch (err) {
      console.error("Failed to occupy lot", err);
    }
  };

  useEffect(() => {
    fetchLots();
    const interval = setInterval(fetchLots, 10000);

    socket.on("lot_update", (data) => {
      console.log("📡 WebSocket received:", data);

      toast.info(
        `📦 Lot ${data.lotCode} is now ${data.isOccupied ? "occupied" : "available"}`
      );

      fetchLots();
    });

    return () => {
      clearInterval(interval);
      socket.off("lot_update");
    };
  }, []);

  return (
    <BackgroundWrapper>
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={4000} />
      <h2 className="text-2xl font-bold mb-4">📦 Lot Occupancy Map</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {lots.map((lot, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-4 text-center font-semibold shadow-md transition-all duration-300 ${
              lot.is_occupied ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            <div className="text-xl">{lot.lot_code}</div>
            <div className="text-sm">{lot.is_occupied ? "Occupied" : "Free"}</div>

            {lot.is_occupied ? (
              <button
                onClick={() => clearLot(lot.lot_code)}
                className="mt-2 text-xs bg-white text-red-600 px-2 py-1 rounded hover:bg-red-100"
              >
                Mark Available
              </button>
            ) : (
              <button
                onClick={() => occupyLot(lot.lot_code)}
                className="mt-2 text-xs bg-white text-green-700 px-2 py-1 rounded hover:bg-green-100"
              >
                Force Occupy
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    </BackgroundWrapper>
  );
};

export default LotGrid;