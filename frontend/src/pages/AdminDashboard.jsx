import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import NavBar from "../components/NavBar";
import TopNav from "../components/TopNav";
import "../components/Dashboard";
import { AlertCircleIcon, ActivityIcon, CheckCircleIcon, ListIcon } from "../components/Icons";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
} from "chart.js";
import { getAllBugs, getAllUsers } from "../services/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

const AdminDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const userName = localStorage.getItem("name") || "Admin User";

  const fetchBugsData = async () => {
    try {
      const data = await getAllBugs();
      setBugs(data || []);
    } catch (error) {
      console.error("Failed to fetch bugs:", error.message);
      setBugs([]); 
    }

    try {
      const userList = await getAllUsers();
      setUsers(userList || []);
    } catch (error) {
      console.error("Failed to fetch users:", error.message);
      setUsers([]); 
    }
  };

  useEffect(() => {
    fetchBugsData();
  }, []);

  // Assignment logic moved to AdminReportedBugs.jsx

  // Stats
  const total = bugs.length;
  const open = bugs.filter(b => b.status === "Open").length;
  const inProgress = bugs.filter(b => b.status === "In Progress").length;
  const resolved = bugs.filter(b => b.status === "Closed").length;

  // --- NEW DEV METRICS ---
  const allDevelopers = users.filter(u => u.role.toLowerCase() === 'developer');
  const totalDevs = allDevelopers.length;

  const assignedDevIds = new Set();
  const DevBugMap = {}; // { devId: { total: 0, resolved: 0 } }

  bugs.forEach(b => {
     if (b.assignedTo) {
        assignedDevIds.add(b.assignedTo);
        if (!DevBugMap[b.assignedTo]) DevBugMap[b.assignedTo] = { total: 0, resolved: 0 };
        DevBugMap[b.assignedTo].total += 1;
        if (b.status === 'Closed' || b.status === 'Resolved' || b.status === 'Verified') {
           DevBugMap[b.assignedTo].resolved += 1;
        }
     }
  });

  const devsAssignedCount = assignedDevIds.size;
  const devsNotAssignedCount = totalDevs > 0 ? totalDevs - devsAssignedCount : 0;
  const highlyPerformantDevsCount = Object.values(DevBugMap).filter(d => d.resolved > 0).length;
  const totalResolvedAssignedBugs = Object.values(DevBugMap).reduce((acc, curr) => acc + curr.resolved, 0);

  // Pie chart data
  const priorityData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: bugs.length > 0
          ? [
              bugs.filter(b => b.priority === "High").length,
              bugs.filter(b => b.priority === "Medium").length,
              bugs.filter(b => b.priority === "Low").length,
            ]
          : [0, 0, 0],
        backgroundColor: ["#f85149", "#eab308", "#3fb950"],
        borderColor: "#161b22",
        borderWidth: 2,
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
        borderColor: "#3fb950",
        backgroundColor: "rgba(63, 185, 80, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="app-container">
      <div className="grid-background" />
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      
      <NavBar role="admin" activePath="/admin" />

      <main className="main-wrapper">
        <TopNav userName={userName} breadcrumb="Overview" />

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Admin Overview</h1>
          </div>

          {/* Stats cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-info">
                <h3>Total Bugs</h3>
                <p>{total}</p>
              </div>
              <div className="metric-icon"><ListIcon size={24}/></div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Open</h3>
                <p>{open}</p>
              </div>
              <div className="metric-icon"><AlertCircleIcon size={24}/></div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>In Progress</h3>
                <p>{inProgress}</p>
              </div>
              <div className="metric-icon"><ActivityIcon size={24}/></div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Resolved</h3>
                <p>{resolved}</p>
              </div>
              <div className="metric-icon"><CheckCircleIcon size={24}/></div>
            </div>
          </div>

          <h2 style={{marginTop: '32px', marginBottom: '16px', fontSize: '1.2rem', color: 'var(--text-primary)'}}>Developer Allocation & Tracking</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-info">
                <h3 style={{fontSize: '0.85rem'}}>Assigned / Total Devs</h3>
                <p style={{fontSize: '1.8rem'}}>{devsAssignedCount} <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>/ {totalDevs}</span></p>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-info">
                <h3 style={{fontSize: '0.85rem'}}>Unassigned (Benched)</h3>
                <p style={{fontSize: '1.8rem'}}>{devsNotAssignedCount}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <h3 style={{fontSize: '0.85rem'}}>Devs w/ Resolved Bugs</h3>
                <p style={{fontSize: '1.8rem'}}>{highlyPerformantDevsCount}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <h3 style={{fontSize: '0.85rem'}}>Total Dev Resolved Bugs</h3>
                <p style={{fontSize: '1.8rem', color: 'var(--accent-green)'}}>{totalResolvedAssignedBugs}</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid" style={{marginTop: '24px'}}>
            <div className="chart-container">
              <h3>Bugs by Priority</h3>
              {bugs.length > 0 ? (
                <Pie data={priorityData} options={{ responsive: true }} />
              ) : (
                <p>Loading chart data...</p>
              )}
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              <div className="chart-container">
                <h3>Bug Trends</h3>
                <Line data={trendData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;