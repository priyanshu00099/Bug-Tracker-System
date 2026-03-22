import React, { useEffect, useState } from "react";
// 1. Import all necessary functions
import { 
  getAllBugs, 
  getTesterBugs, 
  getAssignedBugs, 
  updateBugStatus, 
  deleteBug 
} from "../services/api";
import "../styles/global.css";
import "../styles/Dashboard.css";
import "../styles/BugList.css";
import TopNav from "./TopNav";

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role")?.toLowerCase(); // Get the role

  const fetchBugs = async () => {
    try {
      let data;
      // 2. Call the correct API based on role
      if (role === "admin") data = await getAllBugs();
      else if (role === "tester") data = await getTesterBugs();
      else if (role === "developer") data = await getAssignedBugs();
      
      setBugs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load bugs. Access denied or server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [role]);

  // 3. Proper Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bug?")) {
      try {
        await deleteBug(id);
        setBugs(bugs.filter(bug => bug.id !== id)); // Remove from UI immediately
      } catch (err) {
        alert("Failed to delete bug.");
      }
    }
  };

  // 4. Proper Status Update Handler
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBugStatus(id, status);
      // Update the status in the local state
      setBugs(bugs.map(bug => bug.id === id ? { ...bug, status } : bug));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <p>Loading bugs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page-layout">
      {/* Sidebar logic should also check role for links */}
      <div className="sidebar">
        <h2>Bug Tracker</h2>
        <a href={`/${role}`} className="active">Overview</a>
        <a href="/buglist">Bug List</a>
      </div>

      <div className="page-left dashboard-container buglist-container">
        <TopNav userName={localStorage.getItem("name") || "User"} />

        <ul className="bug-list">
          {bugs.length === 0 ? <p>No bugs found.</p> : bugs.map((bug) => (
            <li key={bug.id}>
              <div className="bug-title">{bug.title}</div>
              <div className="bug-meta">
                {/* Note: Ensure these keys match your SQL column names! */}
                Reporter ID: {bug.reporter_id} | Assignee ID: {bug.assignedTo}
              </div>
              <div className={`status ${bug.status.toLowerCase()}`}>{bug.status}</div>
              
              <div className="bug-actions">
                {/* 5. Use the wrapper functions we created */}
                <button onClick={() => handleStatusUpdate(bug.id, "Open")}>Open</button>
                <button onClick={() => handleStatusUpdate(bug.id, "Closed")}>Close</button>
                {role === "admin" && (
                   <button className="btn-delete" onClick={() => handleDelete(bug.id)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BugList;