import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VehicleList from "./components/VehicleList";
import TripsList from "./components/TripsList";

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Fleet Management System</h1>
        <nav>
          <ul>
            <li><Link to="/">Vozila</Link></li>
            <li><Link to="/trips">Putni nalozi</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<VehicleList />} />
          <Route path="/trips" element={<TripsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;