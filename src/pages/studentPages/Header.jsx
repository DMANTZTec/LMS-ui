import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Get user from localStorage
  const savedUser = JSON.parse(sessionStorage.getItem("otpUser"));
  const email = savedUser?.email;

  // Get first letter of email (capital)
  const firstLetter = email ? email.charAt(0).toUpperCase() : "";

  const handleLogout = () => {
    sessionStorage.removeItem("otpUser");
    sessionStorage.removeItem("tempAuth");

    navigate("/"); // change if your login route is different
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      
      {/* Left side */}
      <h1 className="text-xl font-bold">Student Dashboard</h1>

      {/* Right side */}
      <div>
        {email ? (
          <div className="flex items-center gap-3">
            {/* First letter circle */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
              {firstLetter}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/studentLogin")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;