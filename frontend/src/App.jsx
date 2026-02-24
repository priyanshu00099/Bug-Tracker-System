import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', title: '', description: '', severity: 'Low' });

  // --- Login ---
  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setUser({ email: data.email, role: data.role });
      setPage("dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  // --- Fetch Bugs ---
  const fetchBugs = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/bugs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setBugs(data);
  };

  // --- Report Bug ---
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/bugs`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        severity: form.severity,
        reporter: user.email
      })
    });
    if (res.ok) {
      alert("Bug submitted successfully");
      fetchBugs();
      setPage("dashboard");
    }
  };

  useEffect(() => {
    if (page === 'dashboard') fetchBugs();
  }, [page]);

  // --- Render ---
  if (page === 'login') {
    return (
      <section className="page active">
        <div className="login-box">
          <h1>🐞 Bug Tracker</h1>
          <p>Login to your workspace</p>
          <input type="email" placeholder="Email address"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
          <input type="password" placeholder="Password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
          <button onClick={handleLogin}>Login</button>
          <small>© K.R. Mangalam University</small>
        </div>
      </section>
    );
  }

  return (
    <div className="app-container">
      <header className="topbar">
        <h2>🐞 Bug Tracker</h2>
        <nav>
          <a onClick={() => setPage('dashboard')}>Dashboard</a>
          {user?.role === "Reporter" && <button className="btn-green" onClick={() => setPage('report')}>+ Report Bug</button>}
          {user?.role !== "Reporter" && <a onClick={() => setPage('report')}>Report Bug</a>}
        </nav>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <a className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>Dashboard</a>
          {user?.role !== "Reporter" && <a className={page === 'report' ? 'active' : ''} onClick={() => setPage('report')}>Report Bug</a>}
          {user?.role === "Admin" && <a onClick={() => setPage("manageUsers")}>Manage Users</a>}
        </aside>

        <main className="content">
          {page === 'dashboard' ? (
            <>
              <h2>Dashboard ({user?.role})</h2>
              <div className="cards">
                <div className="card blue"><b>{bugs.length}</b><span>Total Bugs</span></div>
                <div className="card orange"><b>{bugs.filter(b => b.status === 'Open').length}</b><span>Open</span></div>
                <div className="card green"><b>{bugs.filter(b => b.status === 'In Progress').length}</b><span>In Progress</span></div>
                <div className="card navy"><b>{bugs.filter(b => b.status === 'Closed').length}</b><span>Closed</span></div>
              </div>

              <div className="panel">
                <h3>Bug List</h3>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Title</th><th>Severity</th><th>Status</th><th>Assigned</th></tr>
                  </thead>
                  <tbody>
                    {bugs
                      .filter(bug => user.role === "Admin" || bug.assignedTo === user.email || bug.reporter === user.email)
                      .map(bug => (
                        <tr key={bug.id}>
                          <td>#{bug.id}</td>
                          <td>{bug.title}</td>
                          <td>{bug.severity}</td>
                          <td>{bug.status}</td>
                          <td>{bug.assignedTo || "Unassigned"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <h2>Report New Bug</h2>
              <div className="panel form">
                <label>Bug Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}/>
                <label>Description</label>
                <textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/>
                <label>Severity</label>
                <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
                <button className="btn-green" onClick={handleReportSubmit}>Submit Bug</button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;