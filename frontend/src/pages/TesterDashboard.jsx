import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import "../components/Dashboard";
import TopNav from "../components/TopNav";
import { Bar } from "react-chartjs-2";
import { getBugs } from "../services/api";

const TesterDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const userName = localStorage.getItem("name") || "Tester User";

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBugs();
      setBugs(data);
    };
    fetchData();
  }, []);

  const reported = bugs.filter(b => b.reporter === "Raj Patel").length;
  const verified = bugs.filter(b => b.status === "Verified").length;
  const reopened = bugs.filter(b => b.status === "Reopened").length;

  const testerData = {
    labels: ["Raj Patel", "Maria Garcia", "John Doe"],
    datasets: [{ label: "Bugs Reported", data: [reported, 3, 2], backgroundColor: "#4cafef" }],
  };

  return (
    <div className="page-layout">
      <div className="sidebar">
        <h2>Bug Tracker</h2>
        <a href="/tester" className="active">Overview</a>
        <a href="/buglist">Reported Bugs</a>
        <a href="/analytics">Analytics</a>
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