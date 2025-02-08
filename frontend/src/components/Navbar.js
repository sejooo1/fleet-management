import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 py-3 px-6 shadow-md flex justify-center">
      <div className="max-w-6xl w-full flex items-center justify-between">
        {/* Naslov */}
        <Link to="/" className="text-white text-2xl font-bold">
          Fleet Management
        </Link>

        {/* Navigacija */}
        <ul className="flex space-x-6">
          <li><Link to="/" className="text-white hover:underline">Početna</Link></li>
          <li><Link to="/vehicles" className="text-white hover:underline">Lista vozila</Link></li>
          <li><Link to="/trips" className="text-white hover:underline">Lista putnih naloga</Link></li>
          <li><Link to="/reports" className="text-white hover:underline">Kreiranje izvještaja</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;