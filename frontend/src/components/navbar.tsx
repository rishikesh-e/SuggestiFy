import React from "react";

const Navbar = () => {
  return (
    <div className="p-6"> {/* Same outer padding as Profile page */}
      <nav className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">SuggestiFy</div>

        {/* User Actions */}
        <div className="flex space-x-4 items-center">
          <a href="/learn" className="px-3 py-1 rounded hover:bg-gray-200">
            Learn
          </a>
          <a href="/test" className="px-3 py-1 rounded hover:bg-gray-200">
            Take a Test
          </a>
          <a href="/progress" className="px-3 py-1 rounded hover:bg-gray-200">
            Progress
          </a>
          <a href="/profile" className="px-3 py-1 rounded hover:bg-gray-200">
            Profile
          </a>
          <button className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
