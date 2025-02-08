import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import VehicleList from "./components/VehicleList";
import AddVehicleForm from "./components/AddVehicleForm";
import TripsList from "./components/TripsList";
import AddTripForm from "./components/AddTripForm";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/add-vehicle" element={<AddVehicleForm onVehicleAdded={() => window.location.href = "/vehicles"} />} />
          <Route path="/trips" element={<TripsList />} />
          <Route path="/add-trip" element={<AddTripForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
