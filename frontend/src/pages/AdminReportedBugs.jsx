import React, { useEffect, useState } from "react";
import { 
  getAllBugs, 
  getAllUsers,
  assignBug,
  deleteBug
} from "../services/api";
import "../styles/global.css";
import "../styles/Dashboard.css";
import "../styles/BugList.css";
import NavBar from "../components/NavBar";
import TopNav from "../components/TopNav";

const AdminReportedBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Assignment State
  const [assignDevId, setAssignDevId] = useState("");
  const [assignBugId, setAssignBugId] = useState("");
  const [assignStatus, setAssignStatus] = useState({ message: "", type: "" });
  const [isAssigning, setIsAssigning] = useState(false);
  const [matchedDevName, setMatchedDevName] = useState("");

  const role = localStorage.getItem("role")?.toLowerCase();

  const fetchData = async () => {
    if (role === "admin") {
      try {
        const data = await getAllBugs();
        const unassigned = (data || []).filter(b => !b.assignedTo && b.status === "Open");
        setBugs(unassigned);
      } catch (err) {
        console.error("Failed to load bugs", err);
      }
      try {
        const userList = await getAllUsers();
        setUsers(userList || []);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (role === 'admin') fetchData();
  }, [role]);

  // Live String Matcher for Assignment
  useEffect(() => {
    if (assignDevId && users.length > 0) {
      const parsedId = parseInt(assignDevId, 10);
      const dev = users.find(u => u.id === parsedId && u.role.toLowerCase() === "developer");
      if (dev) {
        setMatchedDevName(dev.name);
      } else {
        const anyUser = users.find(u => u.id === parsedId);
        if (anyUser) {
           setMatchedDevName(`Error: ${anyUser.name} is a ${anyUser.role}, not Dev.`);
        } else {
           setMatchedDevName("Developer not found");
        }
      }
    } else {
      setMatchedDevName("");
    }
  }, [assignDevId, users]);

  const handleAssignBug = async () => {
    if (!assignDevId || !assignBugId) {
      setAssignStatus({ message: "Please provide both Bug ID and Developer ID.", type: "error" });
      return;
    }
    const parsedId = parseInt(assignDevId, 10);
    const validDev = users.find(u => u.id === parsedId && u.role.toLowerCase() === "developer");
    if (!validDev) {
      setAssignStatus({ message: "Must assign exclusively to a valid Developer ID.", type: "error" });
      return;
    }

    setIsAssigning(true);
    setAssignStatus({ message: "", type: "" });
    try {
      await assignBug(assignBugId, assignDevId);
      setAssignStatus({ message: `Successfully assigned Bug #${assignBugId} to ${validDev.name}!`, type: "success" });
      fetchData(); // dynamically pull the successfully assigned bug off this backlog
      setAssignDevId("");
      setAssignBugId("");
    } catch (error) {
      setAssignStatus({ message: "Failed to assign bug.", type: "error" });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reported bug?")) {
      try {
        await deleteBug(id);
        setBugs(bugs.filter(bug => bug.id !== id));
      } catch (err) {
        alert("Failed to delete bug.");
      }
    }
  };

  return (
    <div className="app-container">
      <div className="grid-background" />
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      
      <NavBar role={role} activePath="/admin/reported-bugs" />

      <main className="main-wrapper">
        <TopNav userName={localStorage.getItem("name") || "Admin"} breadcrumb="Reported Backlog" />

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Unassigned Reported Bugs</h1>
          </div>

          {/* Dedicated Assignment Module */}
          <div className="chart-container" style={{ marginBottom: '24px', padding: '24px', maxWidth: '600px' }}>
            <h3 style={{marginBottom: '16px'}}>Live Bug Assignment</h3>
            {assignStatus.message && (
              <div className={`alert alert-${assignStatus.type}`} style={{ marginBottom: "16px" }}>
                {assignStatus.message}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Target Bug ID</label>
                <input 
                  type="number" 
                  placeholder="e.g. 12" 
                  className="form-input" 
                  value={assignBugId} 
                  onChange={e => setAssignBugId(e.target.value)} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Assigned Developer UUID</label>
                <input 
                  type="number" 
                  placeholder="e.g. 4" 
                  className="form-input" 
                  value={assignDevId} 
                  onChange={e => setAssignDevId(e.target.value)} 
                />
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '0.85rem', 
                  height: '20px',
                  color: matchedDevName.includes('Error') || matchedDevName.includes('not found') ? 'var(--danger-red)' : 'var(--accent-green)',
                  fontWeight: '500'
                }}>
                  {matchedDevName ? `Target matched: ${matchedDevName}` : ''}
                </div>
              </div>

              <button className="btn-primary" onClick={handleAssignBug} disabled={isAssigning} style={{marginTop: '8px'}}>
                {isAssigning ? "Processing Assignment..." : "Assign to Developer"}
              </button>
            </div>
          </div>

          {/* The Bug List */}
          <div className="buglist-container">
            {loading && <p style={{color: 'var(--text-secondary)'}}>Sourcing unassigned bugs...</p>}
            
            {!loading && (
              <ul className="bug-list">
                {bugs.length === 0 ? <p style={{color: 'var(--text-secondary)'}}>The backlog is perfectly clear. No unassigned bugs!</p> : bugs.map((bug) => (
                  <li key={bug.id}>
                    <div className="bug-header">
                      <div className="bug-title">{bug.title}</div>
                      <div className={`status ${bug.status.toLowerCase().replace(/\s/g, "")}`}>{bug.status}</div>
                    </div>
                    
                    <div className="bug-meta" style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Reporter: {users.find(u => u.id === bug.reporter_id)?.name || "Unknown"} (ID: {bug.reporter_id}) | 
                      Severity: <span style={{ color: bug.severity === 'Critical' ? 'var(--danger-red)' : 'inherit', fontWeight: bug.severity === 'Critical' ? '600' :'normal'}}>{bug.severity}</span>
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
                      <button className="btn-delete" onClick={() => handleDelete(bug.id)}>Discard Issue</button>
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

export default AdminReportedBugs;
