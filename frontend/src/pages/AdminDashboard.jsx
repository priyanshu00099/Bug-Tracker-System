import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import "../components/Dashboard";
import TopNav from "../components/TopNav";
import { Pie, Line } from "react-chartjs-2";
import { getBugs } from "../services/api";

const AdminDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const userName = localStorage.getItem("name") || "Admin User";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBugs();
        setBugs(data || []);
      } catch (error) {
        console.error("Failed to fetch bugs:", error.message);
        setBugs([]); 
      }
    };
    fetchData();
  }, []);

  // Stats
  const total = bugs.length;
  const open = bugs.filter(b => b.status === "Open").length;
  const inProgress = bugs.filter(b => b.status === "In Progress").length;
  const resolved = bugs.filter(b => b.status === "Closed").length;

  // Pie chart data
  const severityData = {
    labels: ["Critical", "Major", "Minor", "Trivial"],
    datasets: [
      {
        data: bugs.length > 0
          ? [
              bugs.filter(b => b.severity === "Critical").length,
              bugs.filter(b => b.severity === "Major").length,
              bugs.filter(b => b.severity === "Minor").length,
              bugs.filter(b => b.severity === "Trivial").length,
            ]
          : [0, 0, 0, 0],
        backgroundColor: ["#ff4d4d", "#ff9800", "#ffeb3b", "#4caf50"],
      },
    ],
  };

  // Line chart data
  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Bugs Reported",
        data: bugs.length > 0 ? [5, 10, 7, 12] : [0, 0, 0, 0],
        borderColor: "#4cafef",
        backgroundColor: "rgba(76, 175, 239, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="page-layout">
      <div className="sidebar">
        <h2>Bug Tracker</h2>
        <a href="/admin" className="active">Overview</a>
        <a href="/buglist">All Bugs</a>
        <a href="/analytics">Analytics</a>
      </div>
      

      <div className="page-left dashboard-container">
        <TopNav userName={userName} />

        {/* Stats cards */}
        <div className="dashboard-cards">
          <div className="card"><h3>Total Bugs</h3><p>{total}</p></div>
          <div className="card"><h3>Open</h3><p>{open}</p></div>
          <div className="card"><h3>In Progress</h3><p>{inProgress}</p></div>
          <div className="card"><h3>Resolved</h3><p>{resolved}</p></div>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="card">
            <h3>Bugs by Severity</h3>
            {bugs.length > 0 ? (
            <Pie data={severityData} options={{ responsive: true }} />
            ) : (
            <p>Loading chart data...</p>
            )}
          </div>
          <div className="card">
            <h3>Bug Trends</h3>
            {/* REMOVED 'key' and 'redraw' */}
            <Line data={trendData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;