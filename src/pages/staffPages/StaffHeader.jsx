import React from "react";
import { useNavigate } from "react-router-dom";

const StaffHeader = () => {
  const navigate = useNavigate();

  // Get user from localStorage
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const name = savedUser?.name;

  // First letter of name
  const firstLetter = name ? name.charAt(0).toUpperCase() : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("tempAuth");

    navigate("/"); // change if needed
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      
      {/* Left */}
      <h1 className="text-xl font-bold">Staff Dashboard</h1>

      {/* Right */}
      <div>
        {name ? (
          <div className="flex items-center gap-3">
            
            {/* Avatar */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white font-bold">
              {firstLetter}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>

          </div>
        ) : (
          <button
            onClick={() => navigate("/staff-login")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default StaffHeader;