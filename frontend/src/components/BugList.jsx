import React, { useEffect, useState } from "react";
import { 
  getAllBugs, 
  getTesterBugs, 
  getAssignedBugs, 
  updateBugStatus, 
  deleteBug,
  getAllUsers
} from "../services/api";
import "../styles/global.css";
import "../styles/Dashboard.css";
import "../styles/BugList.css";
import NavBar from "./NavBar";
import TopNav from "./TopNav";

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role")?.toLowerCase(); 

  const fetchBugs = async () => {
    try {
      let data;
      if (role === "admin") data = await getAllBugs();
      else if (role === "tester") data = await getTesterBugs();
      else if (role === "developer") data = await getAssignedBugs();
      
      setBugs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load bugs. Access denied or server error.");
    }
    
    if (role === "admin") {
      try {
        const userList = await getAllUsers();
        setUsers(userList || []);
      } catch (err) {}
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBugs();
  }, [role]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bug?")) {
      try {
        await deleteBug(id);
        setBugs(bugs.filter(bug => bug.id !== id));
      } catch (err) {
        alert("Failed to delete bug.");
      }
    }
  };

  const handleStatusUpdate = async (id, status, rejectReason = null) => {
    try {
      const res = await updateBugStatus(id, status, rejectReason);
      setBugs(bugs.map(bug => bug.id === id ? { ...bug, status, description: res.bug?.description || bug.description } : bug));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Safe path determination for sidebar
  const getSidebarPath = () => {
    return role === "tester" ? "/tester/buglist" : "/buglist";
  };

  return (
    <div className="app-container">
      <div className="grid-background" />
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      
      <NavBar role={role} activePath={getSidebarPath()} />

      <main className="main-wrapper">
        <TopNav userName={localStorage.getItem("name") || "User"} breadcrumb="Bug Backlog" />

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Bug Backlog</h1>
          </div>

          <div className="buglist-container">
            {loading && <p>Loading bugs...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && (
              <ul className="bug-list">
                {bugs.length === 0 ? <p>No bugs found.</p> : bugs.map((bug) => (
                  <li key={bug.id}>
                    <div className="bug-header">
                      <div className="bug-title">{bug.title}</div>
                      <div className={`status ${bug.status.toLowerCase().replace(/\s/g, "")}`}>{bug.status}</div>
                    </div>
                    
                    <div className="bug-meta">
                      {role === "admin" ? (
                        <>
                          Reporter: {users.find(u => u.id === bug.reporter_id)?.name || "Unknown"} (ID: {bug.reporter_id}) | 
                          Assigned To: {bug.assignedTo ? `${users.find(u => u.id === bug.assignedTo)?.name || "Unknown"} (ID: ${bug.assignedTo})` : "Unassigned"}
                        </>
                      ) : (
                        <>Reporter ID: {bug.reporter_id} | Assignee ID: {bug.assignedTo}</>
                      )}
                    </div>
                    
                    <div className="bug-details" style={{ marginTop: '12px', padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px', borderLeft: '3px solid var(--accent-blue)' }}>
                      <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0', wordBreak: 'break-word' }}>{bug.description}</p>
                      {bug.imageUrl && (
                        <div style={{ marginTop: '16px' }}>
                          <img src={`${(import.meta.env.VITE_API_BASE || "https://bug-tracker-system-2mjo.onrender.com/api").replace('/api', '')}${bug.imageUrl}`} alt="Bug Attachment" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                        </div>
                      )}
                    </div>
                    
                    <div className="bug-actions" style={{ marginTop: '16px' }}>
                      {role === "admin" && (
                         <button className="btn-delete" style={{ backgroundColor: 'var(--danger-red)'}} onClick={() => handleDelete(bug.id)}>Discard Issue</button>
                      )}
                      
                      {role === "tester" && bug.status === "Resolved" && (
                        <>
                          <button style={{ backgroundColor: 'var(--accent-green)'}} onClick={() => handleStatusUpdate(bug.id, "Closed")}>Verify (Close)</button>
                          <button style={{ backgroundColor: 'var(--danger-red)'}} onClick={() => {
                            const reason = window.prompt("Reason for rejection:");
                            if (reason) handleStatusUpdate(bug.id, "In Progress", `--- REJECTED BY TESTER ---\nReason: ${reason}`);
                          }}>Reject (Return)</button>
                        </>
                      )}
                      
                      {role === "developer" && bug.status === "Open" && (
                        <button onClick={() => handleStatusUpdate(bug.id, "In Progress")}>Start Work</button>
                      )}
                      
                      {role === "developer" && bug.status === "In Progress" && (
                        <button style={{ backgroundColor: 'var(--accent-green)'}} onClick={() => {
                          const details = window.prompt("Resolution Details (Required):");
                          if (details) {
                            handleStatusUpdate(bug.id, "Resolved", `--- FIXED BY DEVELOPER ---\nDetails: ${details}`);
                          } else {
                            alert("Action aborted: You must provide resolution details to mark a bug resolved.");
                          }
                        }}>Mark Resolved</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BugList;