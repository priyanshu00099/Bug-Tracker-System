import React, { useEffect, useState } from "react";
import { getBugs, updateBugStatus, deleteBug } from "../services/api";
import "../styles/global.css";
import "../styles/Dashboard.css";
import "../styles/BugList.css";
import TopNav from "./TopNav";

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const data = await getBugs();
        setBugs(data);
      } catch {
        setError("Failed to load bugs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, []);

  if (loading) return <p>Loading bugs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page-layout">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Bug Tracker</h2>
        <a href="/buglist" className="active">Bug List</a>
        <a href="/admin">Admin</a>
        <a href="/analytics">Analytics</a>
      </div>

      <div className="page-left dashboard-container buglist-container">
        <TopNav userName="Priyanshu" toggleSidebar={toggleSidebar} />

        <ul className="bug-list">
          {bugs.map((bug) => (
            <li key={bug.id}>
              <div className="bug-title">{bug.title}</div>
              <div className="bug-meta">
                Reporter: {bug.reporter} | Assignee: {bug.assignee}
              </div>
              <div className={`status ${bug.status.toLowerCase()}`}>{bug.status}</div>
              <div className="bug-actions">
                <button onClick={() => updateBugStatus(bug.id, "open")}>Open</button>
                <button onClick={() => updateBugStatus(bug.id, "closed")}>Close</button>
                <button onClick={() => deleteBug(bug.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BugList;