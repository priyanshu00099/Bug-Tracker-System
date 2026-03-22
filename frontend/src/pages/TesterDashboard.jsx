import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import TopNav from "../components/TopNav";
import { Bar } from "react-chartjs-2";
import { getTesterBugs } from "../services/api";

const TesterDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const userName = localStorage.getItem("name") || "Tester User";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTesterBugs();
        // Ensure data is an array before setting it
        setBugs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Frontend Error:", err);
        setBugs([]); // Reset to empty array so the .filter doesn't crash
      }
    };
    fetchData();
  }, []);

  const reported = bugs.length;
  const verified = bugs.filter(b => b.status === "Verified").length;
  const reopened = bugs.filter(b => b.status === "Reopened").length;

  const testerData = {
    labels: [userName],
    datasets: [{ label: "Bugs Reported", data: [reported], backgroundColor: "#4cafef" }],
  };

  return (
    <div className="page-layout">
      <div className="sidebar">
        <h2>Bug Tracker</h2>
        <a href="/tester" className="active">Overview</a>
        <a href="/tester/buglist">Reported Bugs</a>
      </div>

      <div className="page-left dashboard-container">
        <TopNav userName={userName} />

        <div className="dashboard-cards">
          <div className="card"><h3>Reported Bugs</h3><p>{reported}</p></div>
          <div className="card"><h3>Verified Bugs</h3><p>{verified}</p></div>
          <div className="card"><h3>Reopened Bugs</h3><p>{reopened}</p></div>
        </div>

        <div className="card">
          <h3>Tester Contributions</h3>
          <Bar key={JSON.stringify(testerData)} data={testerData} />
        </div>
      </div>
    </div>
  );
};

export default TesterDashboard;