import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import "../components/Dashboard";
import TopNav from "../components/TopNav";
import { Bar } from "react-chartjs-2";
import { getAssignedBugs } from "../services/api";

const DeveloperDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const userName = localStorage.getItem("name") || "Developer User";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssignedBugs();
        setBugs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch bugs", err);
      }
    };
    fetchData();
  }, []);

  // --- REMOVE THE userId FILTER LINE ---
  // Just use the 'bugs' array directly because the backend already filtered it!
  
  const assigned = bugs.length; 
  const resolved = bugs.filter(b => b.status === "Closed").length;
  // Make sure 'priority' or 'severity' matches your database column name
  const critical = bugs.filter(b => b.priority === "High" || b.severity === "Critical").length;

  const performanceData = {
    labels: [userName, "James", "Priya"],
    datasets: [{ label: "Bugs Resolved", data: [resolved, 2, 1], backgroundColor: "#4cafef" }],
  };

  // ... rest of your JSX

  return (
    <div className="page-layout">
      <div className="sidebar">
        <h2>Bug Tracker</h2>
        <a href="/developer" className="active">Overview</a>
        <a href="/buglist">My Bugs</a>
        <a href="/analytics">Performance</a>
      </div>

      <div className="page-left dashboard-container">
        <TopNav userName={userName} />

        <div className="dashboard-cards">
          <div className="card"><h3>Assigned Bugs</h3><p>{assigned}</p></div>
          <div className="card"><h3>Resolved</h3><p>{resolved}</p></div>
          <div className="card"><h3>Critical</h3><p>{critical}</p></div>
        </div>

        <div className="card">
          <h3>Developer Performance</h3>
          <Bar key={JSON.stringify(performanceData)} data={performanceData} />
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;