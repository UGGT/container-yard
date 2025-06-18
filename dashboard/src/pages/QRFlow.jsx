import React from "react";
import { useNavigate } from "react-router-dom";
import BackgroundWrapper from "../components/BackgroundWrapper";


const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5050"
    : "https://container-yard-1.onrender.com";

const QRFlow = () => {
  const navigate = useNavigate();

  const handleOption = (type) => {
    if (type === "incoming") navigate("/checkin");
    if (type === "outgoing") navigate("/checkout");
  };

  return (
    <BackgroundWrapper>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-bold"> Container Yard Checkpoint</h2>
        <p className="text-gray-600">Select your operation:</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleOption("incoming")}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
          >
             Check-In (Container Arrival)
          </button>

          <button
            onClick={() => handleOption("outgoing")}
            className="w-full py-3 bg-green-600 text-white font-medium rounded hover:bg-green-700"
          >
             Check-Out (Container Pickup)
          </button>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default QRFlow;