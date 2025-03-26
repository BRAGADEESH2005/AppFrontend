import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-white text-lg font-bold">
            Home
          </Link>
        </div>
        <div className="flex items-center">
          <Link
            to="/leaderboard"
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;