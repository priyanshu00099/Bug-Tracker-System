import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import NavBar from "../components/NavBar";
import TopNav from "../components/TopNav";
import "../components/Dashboard";
import { AlertCircleIcon, ActivityIcon, CheckCircleIcon, ListIcon } from "../components/Icons";
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

  const assigned = bugs.length; 
  const resolved = bugs.filter(b => b.status === "Closed").length;
  const critical = bugs.filter(b => b.priority === "High" || b.severity === "Critical").length;

  const performanceData = {
    labels: [userName, "James", "Priya"],
    datasets: [{ label: "Bugs Resolved", data: [resolved, 2, 1], backgroundColor: "#3fb950", borderRadius: 4 }],
  };

  return (
    <div className="app-container">
      <div className="grid-background" />
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      
      <NavBar role="developer" activePath="/developer" />

      <main className="main-wrapper">
        <TopNav userName={userName} breadcrumb="Overview" />

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Developer Workspace</h1>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-info">
                <h3>Assigned Bugs</h3>
                <p>{assigned}</p>
              </div>
              <div className="metric-icon"><ListIcon size={24}/></div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Resolved</h3>
                <p>{resolved}</p>
              </div>
              <div className="metric-icon"><CheckCircleIcon size={24}/></div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Critical</h3>
                <p>{critical}</p>
              </div>
              <div className="metric-icon"><AlertCircleIcon size={24}/></div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              <h3>Developer Performance</h3>
              <Bar key={JSON.stringify(performanceData)} data={performanceData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;