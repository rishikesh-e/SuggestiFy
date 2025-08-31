import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="p-6">
      <nav className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">SuggestiFy</div>
        <div className="flex space-x-4 items-center">
          <a href="/learn" className="px-3 py-1 rounded hover:bg-gray-200">Learn</a>
          <a href="/test" className="px-3 py-1 rounded hover:bg-gray-200">Take a Test</a>
          <a href="/progress" className="px-3 py-1 rounded hover:bg-gray-200">Progress</a>
          <a href="/profile" className="px-3 py-1 rounded hover:bg-gray-200">Profile</a>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
