import React from "react";
import VehicleList from "./components/VehicleList";

function App() {
  return (
    <div>
      <img src="/pong.png" alt="PONG Logo" className="h-16 w-auto mr-4" />
      <h1 className="text-2xl font-bold">Fleet Management System</h1>
      <VehicleList />
    </div>
  );
}

export default App;