import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import "../components/Dashboard";
import TopNav from "../components/TopNav";
import { Bar } from "react-chartjs-2";
import { getBugs } from "../services/api";

const DeveloperDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const userName = localStorage.getItem("name") || "Developer User";

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBugs();
      setBugs(data);
    };
    fetchData();
  }, []);

  const assigned = bugs.filter(b => b.assignee === "Alex Kim").length;
  const resolved = bugs.filter(b => b.assignee === "Alex Kim" && b.status === "Closed").length;
  const critical = bugs.filter(b => b.assignee === "Alex Kim" && b.severity === "Critical").length;

  const performanceData = {
    labels: ["Alex Kim", "James", "Priya"],
    datasets: [{ label: "Bugs Resolved", data: [resolved, 2, 1], backgroundColor: "#4cafef" }],
  };

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