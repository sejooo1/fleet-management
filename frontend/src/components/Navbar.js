import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { login, logout, getCurrentUser } from "../services/auth"; 

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    const loggedInUser = await login(username, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setShowDropdown(false);
      window.location.reload(); // Automatski refresh stranice nakon logina
    } else {
      alert("Pogrešno korisničko ime ili lozinka");
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.reload(); // Automatski refresh stranice nakon logouta
  };

  return (
    <nav className="bg-blue-600 py-3 px-6 shadow-md flex justify-center fixed top-0 w-full z-50">
  <div className="max-w-6xl w-full flex items-center justify-between">
    <Link to="/" className="text-white text-2xl font-bold">Fleet Management</Link>

    <ul className="flex space-x-6">
      <li><Link to="/" className="text-white hover:underline">Početna</Link></li>
      <li><Link to="/vehicles" className="text-white hover:underline">Lista vozila</Link></li>
      <li><Link to="/trips" className="text-white hover:underline">Lista putnih naloga</Link></li>
      <li><Link to="/reports" className="text-white hover:underline">Kreiranje izvještaja</Link></li>
    </ul>

    {/* Login/Logout */}
    <div className="relative">
      {user ? (
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="text-white bg-gray-800 px-4 py-2 rounded">
            {user.username}
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded w-32">
              <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-200">Logout</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => setShowDropdown(!showDropdown)} className="text-white bg-gray-800 px-4 py-2 rounded">
          Login
        </button>
      )}

      {showDropdown && !user && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-4 w-64">
          <form onSubmit={handleLogin} className="space-y-2">
            <input type="text" name="username" placeholder="Username" className="border p-2 rounded w-full" required />
            <input type="password" name="password" placeholder="Password" className="border p-2 rounded w-full" required />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Login</button>
          </form>
        </div>
      )}
    </div>
  </div>
</nav>

  );
};

export default Navbar;