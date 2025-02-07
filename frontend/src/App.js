import React from "react";
import VehicleList from "./components/VehicleList";

function App() {
  return (
    <div className="flex items-center space-x-4 p-4">
      <img src="/pong.png" alt="PONG Logo" className="h-16 w-auto mr-4" />
      <h1 className="text-3xl font-bold">Fleet Management System</h1>
      <VehicleList />
    </div>
  );
}

export default App;