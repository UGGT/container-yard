// src/pages/YardMap.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import BackgroundWrapper from "../components/BackgroundWrapper";

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = [1, 2, 3, 4, 5, 6];

const YardMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [liveAssigned, setLiveAssigned] = useState(null);
  const [completed, setCompleted] = useState(false);

  const assignedLot = location?.state?.assignedLot || liveAssigned || 'C3';
  const rowIndex = ROWS.indexOf(assignedLot[0]);
  const colIndex = parseInt(assignedLot.slice(1)) - 1;

  const entryRow = ROWS.length; // Start below the last row
  const entryCol = Math.floor(COLS.length / 2);

  useEffect(() => {
    const socket = io('http://localhost:5050');
    socket.on('connect', () => console.log('🟢 Connected to WebSocket'));
    socket.on('lot_update', (data) => {
      if (data?.event === 'incoming_checkin') {
        setLiveAssigned(data.lotCode);
      }
    });
    return () => socket.disconnect();
  }, []);

  // Path animation logic
  const path = [];
  for (let i = entryRow; i > rowIndex; i--) {
    path.push({ row: i, col: entryCol, dir: '↑' });
  }
  if (colIndex !== entryCol) {
    const dir = colIndex < entryCol ? '←' : '→';
    const step = colIndex < entryCol ? -1 : 1;
    for (let j = entryCol + step; j !== colIndex + step; j += step) {
      path.push({ row: rowIndex, col: j, dir });
    }
  }

  // Handle Delivery Complete
  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:5050/api/checkins/complete',
        { lotCode: assignedLot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.clear();
      setCompleted(true);
      navigate('/login');
    } catch (err) {
      console.error('❌ Delivery completion failed:', err.message);
    }
  };

  return (
    <BackgroundWrapper>
    <div className="min-h-screen bg-gray-100 px-6 pt-24 pb-10 relative">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        📦 Yard Map – Assigned Lot: <span className="text-green-600">{assignedLot}</span>
      </h2>

      <div className="relative w-fit mx-auto">
        {/* Arrow path animation */}
        {!completed &&
          path.map(({ row, col, dir }, index) => (
            <div
              key={index}
              className="absolute z-20 w-6 h-6 bg-blue-100 border border-blue-400 text-blue-600 text-sm flex items-center justify-center rounded-full animate-bounce"
              style={{
                top: `${row * 4.5}rem`,
                left: `${col * 4.5 + 2}rem`,
                animationDelay: `${index * 0.25}s`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {dir}
            </div>
          ))}

        {/* Yard Lot Grid */}
        <div className="grid grid-cols-6 gap-8 relative z-10">
          {ROWS.map((row) =>
            COLS.map((col) => {
              const lotCode = `${row}${col}`;
              const isAssigned = lotCode === assignedLot;
              return (
                <div
                  key={lotCode}
                  title={`Lot ${lotCode}`}
                  className={`w-16 h-16 flex items-center justify-center font-semibold rounded-md border shadow-md
                    ${
                      isAssigned
                        ? 'bg-green-500 text-white animate-pulse'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  {lotCode}
                </div>
              );
            })
          )}
        </div>
      </div>

      {!completed && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleComplete}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow-lg font-semibold"
          >
            ✅ Delivery Complete
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        🚪 Entry/Exit Gate — Bottom Center
      </div>
    </div>
    </BackgroundWrapper>
  );
};

export default YardMap;