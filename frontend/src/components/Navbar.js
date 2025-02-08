import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Fleet Management</h1>
        <ul className="flex space-x-6">
          <li><Link to="/" className="text-white hover:underline">Početna</Link></li>
          <li><Link to="/vehicles" className="text-white hover:underline">Lista vozila</Link></li>
          <li><Link to="/trips" className="text-white hover:underline">Lista putnih naloga</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;