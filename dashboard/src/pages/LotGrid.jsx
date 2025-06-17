import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackgroundWrapper from "../components/BackgroundWrapper";

// 🌐 Production backend URL
const BACKEND_URL = "https://container-yard-1.onrender.com";
const socket = io(BACKEND_URL, { transports: ["websocket"] });

const LotGrid = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLots = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lots/status`);
      setLots(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch lot status", err);
      toast.error("Failed to fetch lot data");
    } finally {
      setLoading(false);
    }
  };

  const clearLot = async (lotCode) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/lots/${lotCode}/clear`);
      fetchLots();
    } catch (err) {
      console.error("❌ Failed to clear lot", err);
      toast.error("Error clearing lot");
    }
  };

  const occupyLot = async (lotCode) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/lots/${lotCode}/occupy`);
      fetchLots();
    } catch (err) {
      console.error("❌ Failed to occupy lot", err);
      toast.error("Error occupying lot");
    }
  };

  useEffect(() => {
    fetchLots();

    socket.on("lot_update", (data) => {
      toast.info(
        `📦 Lot ${data.lotCode} is now ${data.isOccupied ? "Occupied" : "Available"}`
      );
      fetchLots();
    });

    return () => {
      socket.off("lot_update");
    };
  }, []);

  return (
    <BackgroundWrapper>
      <div className="p-6">
        <ToastContainer position="top-right" autoClose={4000} />
        <h2 className="text-2xl font-bold mb-4">📦 Lot Occupancy Map</h2>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading lots...</div>
        ) : lots.length === 0 ? (
          <div className="text-center text-gray-500">No lot data available.</div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {lots.map((lot, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-4 text-center font-semibold shadow-md transition-all duration-300 ${
                  lot.is_occupied ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                <div className="text-xl">{lot.lot_code}</div>
                <div className="text-sm">
                  {lot.is_occupied ? "Occupied" : "Free"}
                </div>

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
        )}
      </div>
    </BackgroundWrapper>
  );
};

export default LotGrid;