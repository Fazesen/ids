import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/alerts">Alerts</Link>
      <Link to="/live">Live</Link>
    </div>
  );
}

export default Sidebar;
