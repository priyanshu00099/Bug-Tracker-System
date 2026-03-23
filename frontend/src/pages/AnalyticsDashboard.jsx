import React, { useEffect, useState } from "react";
import { 
  getAllBugs, 
  getAssignedBugs, 
  getAllUsers 
} from "../services/api";
import "../styles/global.css";
import "../styles/Dashboard.css";
import NavBar from "../components/NavBar";
import TopNav from "../components/TopNav";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement 
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement
);

const AnalyticsDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const role = localStorage.getItem("role")?.toLowerCase();
  const userName = localStorage.getItem("name") || "User";

  useEffect(() => {
    const loadData = async () => {
      try {
        let bugData = [];
        if (role === "admin") bugData = await getAllBugs();
        else if (role === "developer") bugData = await getAssignedBugs();
        setBugs(Array.isArray(bugData) ? bugData : []);
      } catch (err) {
        console.error("Failed to fetch bugs data", err);
      }
      try {
        let userData = [];
        if (role === "admin") userData = await getAllUsers();
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (err) {
        console.error("Failed to fetch users data", err);
      }
      setLoading(false);
    };
    
    loadData();
  }, [role]);

  // KPIs
  const totalBugs = bugs.length;
  const resolvedBugs = bugs.filter(b => b.status === "Closed" || b.status === "Resolved" || b.status === "Verified").length;
  const completionRate = totalBugs > 0 ? Math.round((resolvedBugs / totalBugs) * 100) : 0;
  
  const criticalOpen = bugs.filter(b => b.priority === "High" && b.status === "Open").length;
  const totalBacklog = bugs.filter(b => b.status === "Open" || b.status === "In Progress").length;

  // 1. Priority Matrix (Doughnut)
  const priorityData = {
    labels: ["High", "Medium", "Low"],
    datasets: [{
      data: [
        bugs.filter(b => b.priority === "High").length,
        bugs.filter(b => b.priority === "Medium").length,
        bugs.filter(b => b.priority === "Low").length,
      ],
      backgroundColor: ["#f85149", "#eab308", "#3fb950"],
      borderColor: "#161b22",
      borderWidth: 2,
    }]
  };

  // 2. Status Distribution (Doughnut)
  const statusData = {
    labels: ["Open", "In Progress", "Closed/Resolved"],
    datasets: [{
      data: [
        bugs.filter(b => b.status === "Open").length,
        bugs.filter(b => b.status === "In Progress").length,
        resolvedBugs
      ],
      backgroundColor: ["#f85149", "#eab308", "#3fb950"],
      borderColor: "#161b22",
      borderWidth: 2,
    }]
  };

  // 3. Workload Analysis (Bar - Admin Only)
  let workloadDataMap = {};
  if (role === "admin" && users.length > 0) {
    const developers = users.filter(u => u.role.toLowerCase() === "developer");
    developers.forEach(dev => workloadDataMap[dev.name] = 0);
    bugs.forEach(bug => {
      if (bug.assignedTo && bug.status !== "Closed") {
        const devMatch = users.find(u => u.id === bug.assignedTo);
        if (devMatch) workloadDataMap[devMatch.name] = (workloadDataMap[devMatch.name] || 0) + 1;
      }
    });
  }

  const workloadData = {
    labels: Object.keys(workloadDataMap),
    datasets: [{
      label: "Active Bugs Explicitly Assigned",
      data: Object.values(workloadDataMap),
      backgroundColor: "#8b5cf6",
      borderRadius: 4,
    }]
  };

  // 4. Real-time Bug Trend (Last 7 Days)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const bugsCreatedPerDay = last7Days.map(date => {
    return bugs.filter(b => b.createdAt && b.createdAt.startsWith(date)).length;
  });

  const bugsResolvedPerDay = last7Days.map(date => {
    return bugs.filter(b => b.updatedAt && b.updatedAt.startsWith(date) && (b.status === 'Resolved' || b.status === 'Closed' || b.status === 'Verified')).length;
  });

  const trendData = {
    labels: last7Days.map(date => {
      const parts = date.split('-');
      return `${parts[1]}/${parts[2]}`; // MM/DD
    }),
    datasets: [
      {
        label: "Bugs Reported",
        data: bugsCreatedPerDay,
        borderColor: "#f85149",
        backgroundColor: "rgba(248, 81, 73, 0.1)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Bugs Resolved",
        data: bugsResolvedPerDay,
        borderColor: "#3fb950",
        backgroundColor: "rgba(63, 185, 80, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="app-container">
      <div className="grid-background" />
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      
      <NavBar role={role} activePath="/analytics" />

      <main className="main-wrapper">
        <TopNav userName={userName} breadcrumb="Agile Analytics & Reporting" />

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Analytics Reporting Suite</h1>
          </div>

          {loading ? (
            <p style={{color: 'var(--text-secondary)'}}>Compiling advanced analytics matrix...</p>
          ) : (
            <>
              {/* KPIs */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-info">
                    <h3 style={{fontSize: '0.85rem'}}>Global Completion Rate</h3>
                    <p style={{fontSize: '2rem', color: completionRate >= 80 ? 'var(--accent-green)' : 'var(--text-primary)'}}>{completionRate}%</p>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-info">
                    <h3 style={{fontSize: '0.85rem'}}>Critical Open Issues</h3>
                    <p style={{fontSize: '2rem', color: criticalOpen > 0 ? 'var(--danger-red)' : 'var(--accent-green)'}}>{criticalOpen}</p>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <h3 style={{fontSize: '0.85rem'}}>Total Active Backlog</h3>
                    <p style={{fontSize: '2rem'}}>{totalBacklog}</p>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <h3 style={{fontSize: '0.85rem'}}>Total Historical Bugs</h3>
                    <p style={{fontSize: '2rem'}}>{totalBugs}</p>
                  </div>
                </div>
              </div>

              {/* Chart Sections */}
              <div className="charts-grid" style={{ marginTop: '24px', gridTemplateColumns: '1fr 1fr' }}>
                <div className="chart-container">
                  <h3 style={{marginBottom: '16px'}}>Priority Matrix</h3>
                  <div style={{ position: 'relative', height: '240px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {totalBugs > 0 ? <Doughnut data={priorityData} options={{ maintainAspectRatio: false }} /> : <p>No Bug Data</p>}
                  </div>
                </div>

                <div className="chart-container">
                  <h3 style={{marginBottom: '16px'}}>Active Status Distribution</h3>
                  <div style={{ position: 'relative', height: '240px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {totalBugs > 0 ? <Doughnut data={statusData} options={{ maintainAspectRatio: false }} /> : <p>No Bug Data</p>}
                  </div>
                </div>
              </div>

              <div className="charts-grid" style={{ marginTop: '24px' }}>
                <div className="chart-container" style={{ gridColumn: role === "admin" ? 'auto' : '1 / -1' }}>
                  <h3 style={{marginBottom: '16px'}}>Bug Trend (Last 7 Days)</h3>
                  <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                    <Line data={trendData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>

                {role === "admin" && (
                  <div className="chart-container">
                    <h3 style={{marginBottom: '16px'}}>Developer Workload Mapping</h3>
                    <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                       <Bar 
                         data={workloadData} 
                         options={{ 
                           indexAxis: 'y', 
                           maintainAspectRatio: false,
                           scales: { x: { ticks: { stepSize: 1 } } } 
                         }} 
                       />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
